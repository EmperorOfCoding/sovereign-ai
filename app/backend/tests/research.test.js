/**
 * Tests for POST /api/research
 * TDD: RED → GREEN → REFACTOR
 *
 * Strategy:
 * - global.fetch is mocked to cover the query-rewriter (cheap model) and OpenRouter calls
 * - @tavily/core is module-mocked so no real Tavily HTTP calls are made
 */

const request = require("supertest");

// ── Module mock: Tavily SDK ────────────────────────────────────────────────
// Must be hoisted before any require() of the app or services
jest.mock("@tavily/core", () => ({
  tavily: jest.fn(() => ({
    search: jest.fn().mockResolvedValue({ results: [] }),
  })),
}));

let app;
let originalEnv;
let originalFetch;

beforeAll(() => {
  // Save original state
  originalEnv = { ...process.env };
  originalFetch = global.fetch;

  // Mock fetch (covers query-rewriter + OpenRouter calls)
  global.fetch = jest.fn();

  // Set required env vars
  process.env.OPENROUTER_API_KEY = "test-key";
  process.env.TAVILY_API_KEY = "test-tavily-key";
  process.env.RATE_LIMIT_MAX = "3";
  process.env.RATE_LIMIT_WINDOW_HOURS = "24";
  process.env.TRUST_PROXY = "1";

  // Load app with mocks active
  jest.resetModules();
  app = require("../index");
});

afterAll(() => {
  // Restore original state
  process.env = originalEnv;
  global.fetch = originalFetch;
});

const MOCK_AI_RESPONSE = {
  evidences: [
    { source: "Reddit", text: "Pain signal detected in the market." },
    { source: "Twitter", text: "Users frustrated with existing tools." },
    { source: "Reclame Aqui", text: "Support gap for small businesses." },
  ],
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
  verdictReason: "Strong pain signal with real evidence. Moderate payment willingness. Recommend proceeding to validation.",
};

/**
 * Creates a mock AI response object for fetch.
 * @param {object} responseData - The AI response data to return
 * @returns {object} Mock fetch response
 */
function makeMockAIResponse(responseData) {
  return {
    ok: true,
    status: 200,
    headers: { get: (name) => (name.toLowerCase() === "content-type" ? "application/json" : null) },
    json: async () => ({
      choices: [{ message: { content: JSON.stringify(responseData) } }],
    }),
  };
}

/**
 * Mocks the full fetch pipeline for the primary model path:
 *  1st call → query-rewriter (returns rewritten query text)
 *  2nd call → OpenRouter primary model (returns AI analysis JSON)
 */
function mockFetchSuccess() {
  // Mock 1: query-rewriter response
  global.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    json: async () => ({
      choices: [{ message: { content: "SaaS para logística no Brasil" } }],
    }),
  });

  // Mock 2: OpenRouter primary model (Gemini) analysis response
  global.fetch.mockResolvedValueOnce(makeMockAIResponse(MOCK_AI_RESPONSE));
}

// Each test group uses a unique IP to avoid rate limit cross-contamination
const TEST_IPS = {
  valid: "10.0.0.1",
  emptyQuery: "10.0.0.2",
  missingQuery: "10.0.0.3",
  longQuery: "10.0.0.4",
  rateLimit: "10.0.0.5",
  apiError: "10.0.0.6",
  tavilyFallback: "10.0.0.7",
  rawEvidences: "10.0.0.8",
  geminiFallback: "10.0.0.9",
};

describe("POST /api/research", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Valid query returns 200 with structured data (primary model: Gemini)", async () => {
    mockFetchSuccess();

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.valid)
      .send({ query: "SaaS para logística no Brasil" });

    if (res.status !== 200) {
      console.log("DEBUG FAIL:", res.status, JSON.stringify(res.body, null, 2));
    }
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      painScore: expect.any(Number),
      verdict: expect.stringMatching(/^(VÁLIDO|INVÁLIDO)$/),
      evidences: expect.any(Array),
      nextSteps: expect.any(Array),
    });

    // With the 3-step pipeline, fetch is called twice: rewriter + primary model
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // 1st call: Rewriter
    const [rewriterUrl, rewriterOptions] = global.fetch.mock.calls[0];
    expect(rewriterUrl).toBe("https://openrouter.ai/api/v1/chat/completions");
    const rewriterBody = JSON.parse(rewriterOptions.body);
    expect(rewriterBody.model).toBe("google/gemini-2.0-flash-lite-001");

    // 2nd call: OpenRouter Analysis (primary model = Gemini 2.5 Flash)
    const [analysisUrl, analysisOptions] = global.fetch.mock.calls[1];
    expect(analysisUrl).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(analysisOptions.method).toBe("POST");
    expect(analysisOptions.headers).toMatchObject({
      Authorization: "Bearer test-key",
      "Content-Type": "application/json",
    });
    const analysisBody = JSON.parse(analysisOptions.body);
    expect(analysisBody.model).toBe("google/gemini-2.5-flash");
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
      const res = await request(app)
        .post("/api/research")
        .set("X-Forwarded-For", TEST_IPS.rateLimit)
        .send({ query: "test query" });
      expect(res.status).toBe(200);
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

  test("6. OpenRouter API failure (both models) returns 500", async () => {
    // Rewriter succeeds
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({ choices: [{ message: { content: "query reescrita" } }] }),
    });
    // Primary model (Gemini) fails
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      headers: { get: () => null },
      text: async () => "Service Unavailable",
    });
    // Fallback model (Claude) also fails
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      headers: { get: () => null },
      text: async () => "Service Unavailable",
    });

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.apiError)
      .send({ query: "valid market question" });

    if (res.status !== 500) console.log("DEBUG FAIL 6:", res.status, res.body);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("ANALYSIS_FAILED");
  });

  test("7. rawEvidences field is present in successful 200 response", async () => {
    mockFetchSuccess();

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.rawEvidences)
      .send({ query: "app de gestão financeira para autônomos" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("rawEvidences");
    expect(Array.isArray(res.body.data.rawEvidences)).toBe(true);
  });

  test("8. Pipeline succeeds even if Tavily returns no results (fallback to [])", async () => {
    // The @tavily/core mock already returns { results: [] } by default.
    // This test verifies the pipeline completes successfully with empty rawEvidences.
    mockFetchSuccess();

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.tavilyFallback)
      .send({ query: "mercado de drones para agricultura" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rawEvidences).toEqual([]);
  });

  test("9. Gemini fails → fallback to Claude succeeds (3 fetch calls)", async () => {
    // Mock 1: Rewriter succeeds
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({
        choices: [{ message: { content: "problema de logística" } }],
      }),
    });

    // Mock 2: Primary model (Gemini) fails with 500
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => null },
      text: async () => "Internal Server Error",
    });

    // Mock 3: Fallback model (Claude) succeeds
    global.fetch.mockResolvedValueOnce(makeMockAIResponse(MOCK_AI_RESPONSE));

    const res = await request(app)
      .post("/api/research")
      .set("X-Forwarded-For", TEST_IPS.geminiFallback)
      .send({ query: "logística para e-commerce" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verdict).toMatch(/^(VÁLIDO|INVÁLIDO)$/);

    // 3 fetch calls: rewriter + Gemini (fail) + Claude (success)
    expect(global.fetch).toHaveBeenCalledTimes(3);

    // Verify the 3rd call used Claude as fallback
    const [, fallbackOptions] = global.fetch.mock.calls[2];
    const fallbackBody = JSON.parse(fallbackOptions.body);
    expect(fallbackBody.model).toBe("anthropic/claude-sonnet-4.6");
  });
});
