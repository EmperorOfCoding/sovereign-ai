/**
 * Tests for POST /api/research
 * TDD: RED → GREEN → REFACTOR
 * 
 * Mocks fetch globally so no real API calls are made during tests.
 */

const request = require("supertest");

// Mock fetch before requiring the app
global.fetch = jest.fn();

// Mock query-rewriter so route tests stay isolated from LLM calls
jest.mock("../services/query-rewriter.service", () => ({
  rewriteQuery: jest.fn(async (q) => q), // identity by default
}));
const { rewriteQuery } = require("../services/query-rewriter.service");

// Set required env vars before loading app
process.env.OPENROUTER_API_KEY = "test-key";
process.env.RATE_LIMIT_MAX = "3";
process.env.RATE_LIMIT_WINDOW_HOURS = "24";
process.env.TRUST_PROXY = "1";

const app = require("../index");

const MOCK_SUCCESS_RESPONSE = {
  evidences: [
    { source: "Reddit r/smallbusiness", sourceUrl: "https://www.reddit.com/r/smallbusiness/comments/abc123", text: "Pain signal detected in the market.", evidenceType: "RELATO_DIRETO" },
    { source: "Twitter", sourceUrl: "https://twitter.com/user/status/123456789", text: "Users frustrated with existing tools.", evidenceType: "FORUM_DISCUSSAO" },
    { source: "Reclame Aqui", sourceUrl: "https://www.reclameaqui.com.br/empresa/reclamacao-123", text: "Support gap for small businesses.", evidenceType: "DADOS_MERCADO" },
  ],
  dataConfidence: 72,
  painScore: 8,
  aiSummaryScore: 7,
  paymentScore: 6,
  nextSteps: [
    "Interview 10 entrepreneurs to validate pain.",
    "Build a minimum viable prototype.",
    "Map direct competitors in the market.",
    "Test willingness to pay via pricing experiments.",
  ],
  verdict: "VÁLIDO",
  verdictReason: "Strong pain signal with real evidence (confidence: 72%). Moderate payment willingness. Recommend proceeding to validation.",
};

function mockFetchSuccess() {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: JSON.stringify(MOCK_SUCCESS_RESPONSE) } }],
    }),
  });
}

// Each test group uses a unique IP to avoid rate limit cross-contamination
const TEST_IPS = {
  valid: '10.0.0.1',
  emptyQuery: '10.0.0.2',
  missingQuery: '10.0.0.3',
  longQuery: '10.0.0.4',
  rateLimit: '10.0.0.5',
  apiError: '10.0.0.6',
};

describe("POST /api/research", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: rewriter is transparent (returns original query)
    rewriteQuery.mockImplementation(async (q) => q);
  });

  test("1. Valid query returns 200 with structured data", async () => {
    mockFetchSuccess();

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.valid)
      .send({ query: "SaaS para logística no Brasil" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      painScore: expect.any(Number),
      verdict: expect.stringMatching(/^(VÁLIDO|INVÁLIDO)$/),
      evidences: expect.any(Array),
      nextSteps: expect.any(Array),
    });

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(options.method).toBe("POST");
    expect(options.headers).toMatchObject({
      Authorization: "Bearer test-key",
      "Content-Type": "application/json",
    });
    const body = JSON.parse(options.body);
    expect(body.model).toBe("anthropic/claude-sonnet-4.6");
    expect(body.messages[1].content).toContain("SaaS para logística no Brasil");
  });

  test("2. Empty query returns 400 validation error", async () => {
    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.emptyQuery)
      .send({ query: "   " });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("INVALID_INPUT");
  });

  test("3. Missing query field returns 400", async () => {
    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.missingQuery)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("INVALID_INPUT");
  });

  test("4. Query over 500 chars returns 400", async () => {
    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.longQuery)
      .send({ query: "a".repeat(501) });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("INVALID_INPUT");
  });

  test("5. Rate limit: 4th request from same IP returns 429", async () => {
    // First 3 succeed (RATE_LIMIT_MAX=3 in test env)
    for (let i = 0; i < 3; i++) {
      mockFetchSuccess();
      await request(app)
        .post("/api/research")
        .set("X-Forwarded-For", TEST_IPS.rateLimit)
        .send({ query: "test query" });
    }

    // 4th request should be rate limited
    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.rateLimit)
      .send({ query: "test query" });

    expect(res.status).toBe(429);
    expect(res.body.error).toBe("RATE_LIMIT_EXCEEDED");
    expect(res.body.retryAfter).toBeGreaterThan(0);
    expect(typeof res.body.retryAfter).toBe("number");
  });

  test("6. OpenRouter API failure returns 500", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => "Service Unavailable",
    });

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.apiError)
      .send({ query: "valid market question" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("ANALYSIS_FAILED");
  });

  test("7. Incoherent result (painScore > 4 + dataConfidence < 40) returns 500", async () => {
    // Simulates the original bug: AI returns painScore=5 with only scarce evidence (cap is now 4)
    const incoherentResponse = {
      ...MOCK_SUCCESS_RESPONSE,
      dataConfidence: 25,   // low confidence
      painScore: 5,         // above the new cap of 4 for confidence < 40
      verdict: "INVÁLIDO", // adjust verdict to avoid the pain+confidence VALID threshold
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(incoherentResponse) } }],
      }),
    });

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", "10.0.0.7")
      .send({ query: "market with sparse data" });

    // Validator must reject: painScore=5 with dataConfidence=25 violates the < 40 cap
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("ANALYSIS_FAILED");
  });

  test("8. Rewritten query (pain language) is passed to main analysis model", async () => {
    // Arrange: rewriter returns an enriched query
    rewriteQuery.mockResolvedValueOnce("é difícil agendar consulta pelo whatsapp");
    mockFetchSuccess();

    // Act
    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", "10.0.0.8")
      .send({ query: "agendamento manual clinica whatsapp" });

    // Assert: route succeeds
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Assert: the enriched query (not the original) was forwarded to OpenRouter
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.messages[1].content).toContain("é difícil agendar consulta pelo whatsapp");
    expect(body.messages[1].content).not.toContain("agendamento manual clinica whatsapp");
  });
});
