/**
 * Query Rewriter Service
 * Uses a cheap/free model to optimize the user's initial prompt into a better search query.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const REWRITER_MODEL = "qwen/qwen3.6-plus:free";
const REWRITER_TIMEOUT_MS = 15000; // 15 seconds (should be fast)

const REWRITER_SYSTEM_PROMPT = `Você é um especialista em busca de inteligência de mercado.
Sua tarefa é transformar o prompt do usuário em uma query de pesquisa de mercado, Com o propósito de encontrar usuários reclamando ou evidencias de mercado. A resposta deve ser concisa e otimizada para encontrar:
- Dores/problemas dos clientes
Responda APENAS com a query reescrita, sem explicações.
A query deve ser em Português Brasileiro.`;

/**
 * @param {string} userQuery - Original user input
 * @returns {Promise<string>} Rewritten, optimized query
 */
async function rewriteQuery(userQuery) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const isDebug = process.env.LOG_LEVEL === "debug";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REWRITER_TIMEOUT_MS);

  if (isDebug) {
    console.log(`[Rewriter] → Optimizing query with ${REWRITER_MODEL}`);
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_ORIGIN?.split(",")[0] || "http://localhost:3000",
        "X-Title": "Sovereign AI Rewriter",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: REWRITER_MODEL,
        messages: [
          { role: "system", content: REWRITER_SYSTEM_PROMPT },
          { role: "user", content: `Rewrite this point: "${userQuery}"` },
        ],
        max_tokens: 100,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[Rewriter] ← API Error: ${errorBody}. Using original query.`);
      return userQuery; // Fallback
    }

    const json = await response.json();
    const rewritten = json.choices?.[0]?.message?.content?.trim();

    if (!rewritten) {
      console.warn("[Rewriter] ← Empty response. Using original query.");
      return userQuery;
    }

    if (isDebug) {
      console.log(`[Rewriter] ✅ Before: "${userQuery}" | After: "${rewritten}"`);
    }

    return rewritten;
  } catch (err) {
    console.warn(`[Rewriter] ❌ Error: ${err.message}. Using original query.`);
    return userQuery; // Fallback to original
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { rewriteQuery };
