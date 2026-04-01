/**
 * Query Rewriter Service
 *
 * Purpose: Convert technical/keyword-style user input into natural human
 * "pain language" — the kind of phrases real people write when complaining,
 * posting on forums, or leaving reviews. This improves the quality of
 * evidence surfaced by the main market analysis model.
 *
 * Design decisions:
 * - Uses a lightweight model (mistral-7b-instruct) to keep latency and cost low.
 * - max_tokens: 60 — a rewritten query must be short and direct.
 * - temperature: 0.3 — slight creativity, but deterministic enough to be predictable.
 * - ALWAYS falls back to the original query on any failure (non-blocking).
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Lightweight, cheap model — intentionally NOT the main analysis model. */
const REWRITER_MODEL = "mistralai/mistral-7b-instruct";

const REWRITER_SYSTEM_PROMPT = `You are a query rewriter for market research. 
Your only task: convert technical keywords into ONE short sentence that sounds like a real person describing their frustration or difficulty.

Rules:
- Output ONLY the rewritten sentence. No explanation, no quotes, no punctuation other than what belongs in the sentence.
- Max 15 words.
- Use Brazilian Portuguese.
- Sound like a real person complaining, not a search query.

Example:
Input: "agendamento manual clinica whatsapp"
Output: é difícil agendar consulta pelo whatsapp`;

/**
 * Rewrites a technical query into human pain language.
 *
 * @param {string} query - Raw user input (technical or keyword-style)
 * @returns {Promise<string>} Rewritten query in pain language, or original as fallback
 * @throws {Error} Only if query is empty/blank — all API failures are silent fallbacks
 */
async function rewriteQuery(query) {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    throw new Error("rewriteQuery: query must be a non-empty string");
  }

  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) {
    console.warn("[QueryRewriter] No API key configured — using original query as fallback.");
    return query;
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_ORIGIN || "http://localhost:3000",
        "X-Title": "Sovereign AI - Query Rewriter",
      },
      body: JSON.stringify({
        model: REWRITER_MODEL,
        messages: [
          { role: "system", content: REWRITER_SYSTEM_PROMPT },
          { role: "user", content: query.trim() },
        ],
        max_tokens: 60,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.warn(`[QueryRewriter] API returned ${response.status} — falling back to original query.`);
      return query;
    }

    const json = await response.json();
    const rewritten = json.choices?.[0]?.message?.content?.trim();

    if (!rewritten) {
      console.warn("[QueryRewriter] Empty content from API — falling back to original query.");
      return query;
    }

    // Strip surrounding quotes that some models add (e.g. "é difícil..." → é difícil...)
    return rewritten.replace(/^["']|["']$/g, "").trim();
  } catch (err) {
    console.warn(`[QueryRewriter] Request failed (${err.message}) — falling back to original query.`);
    return query;
  }
}

module.exports = { rewriteQuery };
