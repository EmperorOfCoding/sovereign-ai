/**
 * Token-optimized OpenRouter service with primary/fallback model strategy.
 *
 * Model strategy:
 * - PRIMARY: google/gemini-2.5-flash (fast, cost-effective)
 * - FALLBACK: anthropic/claude-sonnet-4.6 (deeper reasoning for complex cases)
 *
 * The primary model handles most analyses. If it fails (HTTP error, timeout,
 * invalid JSON, or validation failure), the service automatically retries
 * with the fallback model before propagating the error.
 *
 * Optimization strategies:
 * - System prompt is minimal (defines format only, no filler)
 * - Real Tavily evidences are injected as context before analysis
 * - Response is strict JSON — no markdown, no explanation tokens wasted
 * - max_tokens capped at 800 (larger to accommodate richer context)
 * - temperature: 0 (deterministic = no retries from hallucinations)
 */


const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Primary model: fast + cheap for 90%+ of analyses */
const PRIMARY_MODEL = "google/gemini-2.5-flash";
const PRIMARY_TIMEOUT_MS = 20000; // 20s — Gemini is faster

/** Fallback model: deeper reasoning for complex/ambiguous cases */
const FALLBACK_MODEL = "anthropic/claude-sonnet-4.6";
const FALLBACK_TIMEOUT_MS = 30000; // 30s — Claude needs more time

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
- evidences: exactly 3 items selected or synthesized from the provided raw evidences, each ≤ 35 words
- nextSteps: exactly 4 items grounded in the evidence, each ≤ 25 words
- verdictReason: ≤ 80 words, must reference specific evidence
- Scores must reflect the quality and quantity of raw evidence provided
- All text in Brazilian Portuguese`;

/**
 * Calls a specific model on OpenRouter and returns the parsed result.
 *
 * @param {string} model - OpenRouter model identifier
 * @param {string} userPrompt - The fully constructed user prompt
 * @param {number} timeoutMs - Request timeout in milliseconds
 * @param {boolean} isDebug - Whether to log debug information
 * @returns {Promise<object>} Parsed and validated analysis result
 */
async function callModel(model, userPrompt, timeoutMs, isDebug) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (isDebug) {
    console.log(`[OpenRouter] → Sending request | model: ${model} | timeout: ${timeoutMs}ms`);
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
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0,
      }),
    });

    if (isDebug) {
      console.log(`[OpenRouter] ← HTTP ${response.status} | model: ${model}`);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[OpenRouter] ← Error body (${model}): ${errorBody}`);
      const err = new Error(`OpenRouter error ${response.status}: ${errorBody}`);
      err.status = 500;
      err.code = "ANALYSIS_FAILED";
      throw err;
    }

    const json = await response.json();

    if (isDebug) {
      const usage = json.usage;
      console.log(`[OpenRouter] ← Tokens (${model}): prompt=${usage?.prompt_tokens} completion=${usage?.completion_tokens} total=${usage?.total_tokens}`);
    }

    const rawContent = json.choices?.[0]?.message?.content;

    if (!rawContent) {
      const err = new Error(`Empty response from model: ${model}`);
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
      console.error(`[OpenRouter] ← JSON parse failed (${model}). Content (${len} chars): ${preview}...`);
      const parseErr = new Error(`Failed to parse AI response as JSON: ${err.message}. Model: ${model}`);
      parseErr.status = 500;
      parseErr.code = "ANALYSIS_FAILED";
      throw parseErr;
    }

    validateResult(parsed);

    if (isDebug) {
      console.log(`[OpenRouter] ✅ Analysis complete | model: ${model} | verdict: ${parsed.verdict} | pain: ${parsed.painScore}`);
    }

    return parsed;
  } catch (err) {
    if (err.name === "AbortError") {
      const timeoutErr = new Error(`Request to ${model} timed out after ${timeoutMs}ms`);
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
 * Analyzes market viability using a primary/fallback model strategy.
 *
 * Flow:
 *   1. Try PRIMARY_MODEL (Gemini 2.5 Flash) — fast, cost-effective
 *   2. If it fails for any reason, retry with FALLBACK_MODEL (Claude Sonnet)
 *   3. If both fail, propagate the fallback error
 *
 * @param {string} query - The market research question from the user
 * @param {import('./tavily.service').RawEvidence[]} [rawEvidences=[]] - Real evidences from Tavily
 * @returns {Promise<object>} Structured analysis result
 */
async function analyzeMarket(query, rawEvidences = []) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const isDebug = process.env.LOG_LEVEL === "debug";

  // Build the user prompt: inject raw Tavily evidences when available
  let userPrompt = `Analyze this market problem: "${query}"`;

  if (rawEvidences.length > 0) {
    const evidenceBlock = rawEvidences
      .map((ev, i) => `[${i + 1}] (${ev.type === 'complaint' ? 'Reclamação' : 'Pesquisa'}) ${ev.source}: "${ev.text}"`)
      .join("\n");
    userPrompt += `\n\nRaw market evidences collected (use these as primary source):\n${evidenceBlock}`;
  }

  if (isDebug) {
    console.log(`[OpenRouter] → Query: "${query}" | evidences: ${rawEvidences.length} | primary: ${PRIMARY_MODEL}`);
  }

  // Step 1: Try primary model (Gemini 2.5 Flash)
  try {
    const result = await callModel(PRIMARY_MODEL, userPrompt, PRIMARY_TIMEOUT_MS, isDebug);

    if (isDebug) {
      console.log(`[OpenRouter] ✅ Primary model (${PRIMARY_MODEL}) succeeded`);
    }

    return result;
  } catch (primaryErr) {
    console.warn(`[OpenRouter] ⚠️ Primary model (${PRIMARY_MODEL}) failed: ${primaryErr.message}. Falling back to ${FALLBACK_MODEL}...`);
  }

  // Step 2: Fallback to Claude
  try {
    const result = await callModel(FALLBACK_MODEL, userPrompt, FALLBACK_TIMEOUT_MS, isDebug);

    if (isDebug) {
      console.log(`[OpenRouter] ✅ Fallback model (${FALLBACK_MODEL}) succeeded`);
    }

    return result;
  } catch (fallbackErr) {
    console.error(`[OpenRouter] ❌ Fallback model (${FALLBACK_MODEL}) also failed: ${fallbackErr.message}`);
    throw fallbackErr;
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
