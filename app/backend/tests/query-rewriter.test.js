/**
 * Tests for query-rewriter.service.js
 * TDD: RED → GREEN → REFACTOR
 *
 * The rewriter converts technical user input into human pain language
 * to surface more real-world evidence from the main AI call.
 *
 * Mock fetch so no real API calls happen during tests.
 */

// Mock fetch before requiring the service
global.fetch = jest.fn();
process.env.OPENROUTER_API_KEY = "test-key";

const { rewriteQuery } = require("../services/query-rewriter.service");

// Helper to simulate a successful LLM response for the rewriter
function mockRewriterSuccess(rewrittenQuery) {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: rewrittenQuery } }],
    }),
  });
}

describe("rewriteQuery()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Converts technical input into human pain language", async () => {
    mockRewriterSuccess("é difícil agendar consulta pelo whatsapp");

    const result = await rewriteQuery("agendamento manual clinica whatsapp");

    expect(result).toBe("é difícil agendar consulta pelo whatsapp");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");

    const body = JSON.parse(options.body);
    // Must use a lightweight / cheap model — NOT claude-sonnet
    expect(body.model).not.toContain("claude-sonnet");
    // Token budget must be tight (rewritten query is short)
    expect(body.max_tokens).toBeLessThanOrEqual(60);
  });

  test("2. Returns original query as fallback when API fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await rewriteQuery("SaaS logística rastreamento");

    // Must not throw — graceful fallback
    expect(result).toBe("SaaS logística rastreamento");
  });

  test("3. Returns original query as fallback when API returns empty content", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: "  " } }] }),
    });

    const result = await rewriteQuery("ERP para pequenas empresas");

    expect(result).toBe("ERP para pequenas empresas");
  });

  test("4. Returns original query as fallback when API returns non-ok status", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => "Too Many Requests",
    });

    const result = await rewriteQuery("gestão de estoque manual");

    expect(result).toBe("gestão de estoque manual");
  });

  test("5. Strips surrounding quotes from the rewritten result", async () => {
    // LLM sometimes wraps output in quotes — must be cleaned
    mockRewriterSuccess('"não consigo controlar meu estoque direito"');

    const result = await rewriteQuery("gestão de estoque manual");

    expect(result).toBe("não consigo controlar meu estoque direito");
  });

  test("6. Throws for empty or blank input", async () => {
    await expect(rewriteQuery("   ")).rejects.toThrow("rewriteQuery: query must be a non-empty string");
    await expect(rewriteQuery("")).rejects.toThrow("rewriteQuery: query must be a non-empty string");
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
