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
const MODEL = "anthropic/claude-sonnet-4.5";
const OPENROUTER_TIMEOUT_MS = 30000; // 30 seconds

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

  const isDebug = process.env.LOG_LEVEL === "debug";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

  if (isDebug) {
    console.log(`[OpenRouter] → Sending request | model: ${MODEL} | query length: ${query.length}`);
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_ORIGIN?.split(",")[0] || "http://localhost:3000",
        "X-Title": "Sovereign AI",
      },
      signal: controller.signal,
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

    if (isDebug) {
      console.log(`[OpenRouter] ← HTTP ${response.status} | content-type: ${response.headers.get("content-type")}`);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[OpenRouter] ← Error body: ${errorBody}`);
      const err = new Error(`OpenRouter error ${response.status}: ${errorBody}`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }

    const json = await response.json();

    if (isDebug) {
      const usage = json.usage;
      console.log(`[OpenRouter] ← Tokens: prompt=${usage?.prompt_tokens} completion=${usage?.completion_tokens} total=${usage?.total_tokens}`);
    }

    const rawContent = json.choices?.[0]?.message?.content;

    if (!rawContent) {
      const err = new Error("Empty response from OpenRouter");
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      const preview = (rawContent || "").substring(0, 100);
      const len = (rawContent || "").length;
      console.error(`[OpenRouter] ← JSON parse failed. Content (${len} chars): ${preview}...`);
      const parseErr = new Error(`Failed to parse AI response as JSON: ${err.message}. Content length: ${len}, Preview: ${preview}...`);
      parseErr.status = 500;
      parseErr.code = "ANALYSIS_FAILED";
      throw parseErr;
    }

    validateResult(parsed);

    if (isDebug) {
      console.log(`[OpenRouter] ✅ Analysis complete | verdict: ${parsed.verdict} | pain: ${parsed.painScore}`);
    }

    return parsed;
  } catch (err) {
    if (err.name === "AbortError") {
      const timeoutErr = new Error(`Request to OpenRouter timed out after ${OPENROUTER_TIMEOUT_MS}ms`);
      timeoutErr.status = 500;
      timeoutErr.code = "ANALYSIS_FAILED";
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Basic shape validation to avoid sending malformed data to the frontend.
 * @param {object} data
 */
function validateResult(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const err = new Error("Invalid response format: Data is not a valid object");
    err.status = 500;
    err.code = "ANALYSIS_FAILED";
    throw err;
  }

  const required = [
    "evidences",
    "painScore",
    "aiSummaryScore",
    "paymentScore",
    "nextSteps",
    "verdict",
    "verdictReason",
  ];
  for (const key of required) {
    if (data[key] === undefined) {
      const err = new Error(`Missing field in AI response: ${key}`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }
  }

  // Number/Range validation
  const scoresToValidate = [
    { name: "painScore", value: data.painScore },
    { name: "aiSummaryScore", value: data.aiSummaryScore },
    { name: "paymentScore", value: data.paymentScore },
  ];

  for (const score of scoresToValidate) {
    const val = Number(score.value);
    if (isNaN(val) || val < 1 || val > 10) {
      const err = new Error(`Invalid ${score.name}: must be a number between 1 and 10`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }
    // Ensure the value in the data object is the numeric one
    data[score.name] = val;
  }

  if (!Array.isArray(data.evidences) || data.evidences.length === 0) {
    const err = new Error("Invalid evidences array");
    err.status = 500;
    err.code = "ANALYSIS_FAILED";
    throw err;
  }

  data.evidences.forEach((ev, idx) => {
    if (!ev || typeof ev !== "object" || Array.isArray(ev)) {
      const err = new Error(`Evidence at index ${idx} must be an object`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }
    if (typeof ev.source !== "string" || !ev.source.trim()) {
      const err = new Error(`Evidence at index ${idx} has invalid source`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }
    if (typeof ev.text !== "string" || !ev.text.trim()) {
      const err = new Error(`Evidence at index ${idx} has invalid text`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }
  });

  if (!Array.isArray(data.nextSteps) || data.nextSteps.length === 0) {
    const err = new Error("Invalid nextSteps array");
    err.status = 500;
    err.code = "ANALYSIS_FAILED";
    throw err;
  }

  data.nextSteps.forEach((step, idx) => {
    if (typeof step !== "string" || !step.trim()) {
      const err = new Error(`Next step at index ${idx} must be a non-empty string`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }
  });

  if (!["VÁLIDO", "INVÁLIDO"].includes(data.verdict)) {
    const err = new Error(`Invalid verdict value: ${data.verdict}`);
    err.status = 500;
    err.code = "ANALYSIS_FAILED";
    throw err;
  }

  if (typeof data.verdictReason !== "string" || !data.verdictReason.trim()) {
    const err = new Error("Invalid or missing verdictReason");
    err.status = 500;
    err.code = "ANALYSIS_FAILED";
    throw err;
  }
}

module.exports = { analyzeMarket };
