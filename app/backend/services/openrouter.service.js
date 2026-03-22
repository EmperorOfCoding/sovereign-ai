/**
 * Token-optimized OpenRouter service.
 * 
 * Optimization strategies:
 * - System prompt is minimal (defines format only, no filler)
 * - User prompt is a single concise line
 * - Response is strict JSON — no markdown, no explanation tokens wasted
 * - max_tokens capped at 700 (enough for the structured output)
 * - temperature: 0 (deterministic = no retries from hallucinations)
 * - top_p: 1, frequency_penalty: 0 (defaults, not adding extra tokens)
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4-5";

const SYSTEM_PROMPT = `You are a market research analyst. Respond ONLY with a valid JSON object — no markdown, no explanation.

JSON shape (all fields required):
{
  "evidences": [{ "source": string, "text": string }],
  "painScore": number (1-10),
  "aiSummaryScore": number (1-10),
  "paymentScore": number (1-10),
  "nextSteps": [string],
  "verdict": "VÁLIDO" | "INVÁLIDO",
  "verdictReason": string
}

Rules:
- evidences: exactly 3 items, each ≤ 30 words
- nextSteps: exactly 4 items, each ≤ 25 words
- verdictReason: ≤ 60 words
- All text in Brazilian Portuguese`;

/**
 * @param {string} query - The market research question from the user
 * @returns {Promise<object>} Structured analysis result
 */
async function analyzeMarket(query) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.FRONTEND_ORIGIN || "http://localhost:3000",
      "X-Title": "Sovereign AI",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this market: "${query}"` },
      ],
      max_tokens: 700,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${errorBody}`);
  }

  const json = await response.json();
  const rawContent = json.choices?.[0]?.message?.content;

  if (!rawContent) throw new Error("Empty response from OpenRouter");

  const parsed = JSON.parse(rawContent);
  validateResult(parsed);

  return parsed;
}

/**
 * Basic shape validation to avoid sending malformed data to the frontend.
 * @param {object} data
 */
function validateResult(data) {
  const required = ["evidences", "painScore", "aiSummaryScore", "paymentScore", "nextSteps", "verdict", "verdictReason"];
  for (const key of required) {
    if (data[key] === undefined) throw new Error(`Missing field in AI response: ${key}`);
  }
  if (!Array.isArray(data.evidences) || data.evidences.length === 0) {
    throw new Error("Invalid evidences array");
  }
  if (!Array.isArray(data.nextSteps) || data.nextSteps.length === 0) {
    throw new Error("Invalid nextSteps array");
  }
  if (!["VÁLIDO", "INVÁLIDO"].includes(data.verdict)) {
    throw new Error(`Invalid verdict value: ${data.verdict}`);
  }
}

module.exports = { analyzeMarket };
