/**
 * Raw-evidence OpenRouter service.
 *
 * Core principle: the AI acts as a RAW DATA REPORTER, not a synthesizer.
 * Every evidence item must be a verbatim quote from a real, verifiable source.
 * AI inference is banned from evidence. Scores are hard-capped by dataConfidence.
 *
 * Key constraints:
 * - evidences: 1–5 verbatim quotes, each with a verifiable sourceUrl
 * - No INFERENCIA type allowed — only RELATO_DIRETO, FORUM_DISCUSSAO, DADOS_MERCADO
 * - dataConfidence: 0–100 (drives hard cap on painScore)
 * - temperature: 0 (deterministic = no hallucination drift)
 * - max_tokens: 1000 (room for raw verbatim quotes)
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4.6";
const OPENROUTER_TIMEOUT_MS = 30000; // 30 seconds

const SYSTEM_PROMPT = `You are a raw market data reporter. Your ONLY job is to surface verbatim, verifiable evidence — never to synthesize, infer, or generalize. Respond ONLY with a valid JSON object — no markdown, no explanation.

JSON shape (all fields required):
{
  "evidences": [{ "source": string, "sourceUrl": string, "text": string, "evidenceType": "RELATO_DIRETO" | "FORUM_DISCUSSAO" | "DADOS_MERCADO" }],
  "dataConfidence": number (0-100),
  "painScore": number (1-10),
  "aiSummaryScore": number (1-10),
  "paymentScore": number (1-10),
  "nextSteps": [string],
  "verdict": "VÁLIDO" | "INVÁLIDO",
  "verdictReason": string
}

MANDATORY RULES — violating any of these makes the entire response invalid:

[EVIDENCE RULES]
1. Each evidence item MUST be a verbatim raw quote — copy the exact words a real person wrote. Do NOT paraphrase, summarize, or interpret.
2. evidenceType options (INFERENCIA is FORBIDDEN):
   - RELATO_DIRETO: exact quote from a real user complaint, review, or report (highest value)
   - FORUM_DISCUSSAO: verbatim excerpt from a real public forum thread or community post
   - DADOS_MERCADO: exact statistic or data point from a real published report (include the number)
3. sourceUrl: provide the real URL where the evidence can be verified. If you cannot provide a real URL, DO NOT include that evidence item.
4. Minimum 1, maximum 5 evidence items. Each text field ≤ 50 words.
5. If no verifiable evidence exists, return evidences: [] and set dataConfidence to 0.

[SCORING RULES]
6. dataConfidence reflects ONLY the quantity and quality of verifiable evidence:
   - 70–100: 3+ direct user reports or quantifiable data with real sources
   - 40–69: 1–2 direct signals, at least one with a verifiable source
   - 0–39: no direct user reports — evidence is absent or unverifiable
7. painScore calibration — MANDATORY alignment with dataConfidence:
   - dataConfidence < 40 → painScore MUST be ≤ 4
   - dataConfidence 40–69 → painScore range 1–6
   - dataConfidence ≥ 70 → painScore range 1–10
8. verdict VÁLIDO ONLY if painScore ≥ 6 AND dataConfidence ≥ 40

[NEXT STEPS RULES]
9. nextSteps: exactly 4 items. Each step MUST be derived from the evidence already found — what to DO with the data, not where to search for more data.
   - FORBIDDEN: suggesting to search Reddit, Reclame Aqui, Google, forums, or any external platform
   - FORBIDDEN: suggesting to "conduct market research" or "validate with users" generically
   - REQUIRED: concrete actions based on the evidence above (e.g., "Contact the 3 companies who reported X to offer a direct solution", "Replicate the workflow described in [source] to measure time cost")
10. verdictReason: ≤ 80 words. State the number of verifiable sources found and confidence level. Be factual, not promotional.
11. All text in Brazilian Portuguese`;

/**
 * @param {string} query - The market research question from the user
 * @returns {Promise<object>} Structured analysis result
 */
async function analyzeMarket(query) {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

  try {
    console.debug(`[OpenRouter] Sending request for query: "${query.substring(0, 50)}..."`);
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_ORIGIN || "http://localhost:3000",
        "X-Title": "Sovereign AI",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this market: "${query}"` },
        ],
        max_tokens: 1000,
        temperature: 0,
      }),
    }).catch(err => {
      console.error("[OpenRouter] Fetch low-level failure:", err.message);
      if (err.cause) console.error("[OpenRouter] Cause:", err.cause.message || err.cause);
      throw err;
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errorBody}`);
    }

    const json = await response.json();
    const rawContent = json.choices?.[0]?.message?.content;

    if (!rawContent) throw new Error("Empty response from OpenRouter");

    let parsed;
    try {
      parsed = extractJson(rawContent);
    } catch (err) {
      const preview = (rawContent || "").substring(0, 50);
      const len = (rawContent || "").length;
      throw new Error(`Failed to parse AI response as JSON: ${err.message}. Content length: ${len}, Preview: ${preview}...`);
    }

    validateResult(parsed);
    return parsed;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(`Request to OpenRouter timed out after ${OPENROUTER_TIMEOUT_MS}ms`);
    }
    throw err;
  }
}

/**
 * Shape + coherence validation.
 *
 * Enforces hard rules that align scores with evidence volume:
 * - Low dataConfidence caps painScore to prevent false positives
 * - Verdict VÁLIDO requires minimum pain + confidence thresholds
 *
 * @param {object} data
 */
function validateResult(data) {
  const required = [
    "evidences",
    "dataConfidence",
    "painScore",
    "aiSummaryScore",
    "paymentScore",
    "nextSteps",
    "verdict",
    "verdictReason",
  ];
  for (const key of required) {
    if (data[key] === undefined) throw new Error(`Missing field in AI response: ${key}`);
  }

  // Validate dataConfidence
  const confidence = Number(data.dataConfidence);
  if (isNaN(confidence) || confidence < 0 || confidence > 100) {
    throw new Error("Invalid dataConfidence: must be a number between 0 and 100");
  }
  data.dataConfidence = confidence;

  // Number/Range validation for scores
  const scoresToValidate = [
    { name: "painScore", value: data.painScore },
    { name: "aiSummaryScore", value: data.aiSummaryScore },
    { name: "paymentScore", value: data.paymentScore },
  ];

  for (const score of scoresToValidate) {
    const val = Number(score.value);
    if (isNaN(val) || val < 1 || val > 10) {
      throw new Error(`Invalid ${score.name}: must be a number between 1 and 10`);
    }
    data[score.name] = val;
  }

  // Coherence rule: painScore must be proportional to dataConfidence (stricter thresholds)
  if (confidence < 40 && data.painScore > 4) {
    throw new Error(
      `Incoherent result: painScore=${data.painScore} cannot be > 4 when dataConfidence=${confidence} (< 40%). Insufficient evidence.`
    );
  }
  if (confidence < 70 && data.painScore > 6) {
    throw new Error(
      `Incoherent result: painScore=${data.painScore} cannot be > 6 when dataConfidence=${confidence} (< 70%). Insufficient evidence volume.`
    );
  }

  const ALLOWED_EVIDENCE_TYPES = ['RELATO_DIRETO', 'FORUM_DISCUSSAO', 'DADOS_MERCADO'];

  if (!Array.isArray(data.evidences)) {
    throw new Error("Invalid evidences: must be an array");
  }
  // Allow empty array only when confidence is 0 (no verifiable data found)
  if (data.evidences.length === 0 && confidence > 0) {
    throw new Error("Invalid evidences: array is empty but dataConfidence > 0 — inconsistent.");
  }
  if (data.evidences.length > 5) {
    throw new Error("Invalid evidences array: must have at most 5 items");
  }

  // Per-evidence validation: enforce raw-data contract
  data.evidences.forEach((ev, i) => {
    if (!ev.sourceUrl || typeof ev.sourceUrl !== 'string' || !ev.sourceUrl.startsWith('http')) {
      throw new Error(`Evidence[${i}] missing or invalid sourceUrl — unverifiable evidence is not allowed.`);
    }
    if (!ALLOWED_EVIDENCE_TYPES.includes(ev.evidenceType)) {
      throw new Error(`Evidence[${i}] has forbidden evidenceType: "${ev.evidenceType}". Allowed: ${ALLOWED_EVIDENCE_TYPES.join(', ')}.`);
    }
    if (!ev.text || typeof ev.text !== 'string' || ev.text.trim().length === 0) {
      throw new Error(`Evidence[${i}] has empty text.`);
    }
  });

  if (!Array.isArray(data.nextSteps) || data.nextSteps.length === 0) {
    throw new Error("Invalid nextSteps array");
  }
  if (!["VÁLIDO", "INVÁLIDO"].includes(data.verdict)) {
    throw new Error(`Invalid verdict value: ${data.verdict}`);
  }
}

/**
 * Extracted helper to safely parse JSON from AI responses that might contain markdown or filler text.
 * @param {string} text 
 * @returns {object}
 */
function extractJson(text) {
  try {
    // 1. Try direct parse (most efficient)
    return JSON.parse(text);
  } catch (err) {
    // 2. Try to find content between ```json and ```
    const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = text.match(markdownRegex);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerErr) {
        // Fall through to general extract if markdown parse fails
      }
    }

    // 3. Fallback: Find the first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (finalErr) {
        throw new Error(`JSON content found but still invalid: ${finalErr.message}`);
      }
    }

    throw new Error("No valid JSON object found in response");
  }
}

module.exports = { analyzeMarket };
