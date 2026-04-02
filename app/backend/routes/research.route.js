const express = require("express");
const rateLimiter = require("../middleware/rateLimiter");
const { rewriteQuery } = require("../services/query-rewriter.service");
const { fetchEvidences } = require("../services/tavily.service");
const { analyzeMarket } = require("../services/openrouter.service");

const router = express.Router();

/**
 * Validates the request body before hitting the rate limiter.
 * Invalid queries never consume a rate-limit slot.
 */
function validateQuery(req, res, next) {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "INVALID_INPUT", message: "O campo 'query' é obrigatório." });
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: "INVALID_INPUT", message: "A pesquisa não pode estar vazia." });
  }
  if (trimmed.length > 500) {
    return res.status(400).json({ error: "INVALID_INPUT", message: "A pesquisa não pode ter mais de 500 caracteres." });
  }

  req.validatedQuery = trimmed;
  next();
}

/**
 * POST /api/research
 *
 * 3-step pipeline:
 *   1. rewriteQuery  — optimizes the raw user input (cheap model)
 *   2. fetchEvidences — collects real market signals via Tavily (parallel)
 *   3. analyzeMarket  — scores + verdict via Claude (with injected context)
 *
 * Body: { query: string }
 * Returns: { success: true, data: AnalysisResult & { rawEvidences: RawEvidence[] } }
 */
router.post("/research", validateQuery, rateLimiter, async (req, res, next) => {
  const isDebug = process.env.LOG_LEVEL === "debug";

  try {
    // Step 1: Rewrite the user query into an optimized problem statement
    const rewrittenQuery = await rewriteQuery(req.validatedQuery);

    if (isDebug) {
      console.log(`[/api/research] Step 1 ✅ Rewritten: "${rewrittenQuery}"`);
    }

    // Step 2: Collect real market evidences from Tavily (graceful fallback to [])
    const rawEvidences = await fetchEvidences(rewrittenQuery);

    if (isDebug) {
      console.log(`[/api/research] Step 2 ✅ Evidences: ${rawEvidences.length} items`);
    }

    // Step 3: Run AI analysis with real evidences injected as context
    const analysisData = await analyzeMarket(rewrittenQuery, rawEvidences);

    if (isDebug) {
      console.log(`[/api/research] Step 3 ✅ Analysis complete | verdict: ${analysisData.verdict}`);
    }

    return res.json({
      success: true,
      data: {
        ...analysisData,
        rawEvidences,
      },
    });
  } catch (err) {
    const clientIp = req.headers["x-forwarded-for"] || req.ip;
    const sanitizedQuery = (req.validatedQuery || "").substring(0, 20) + "... (len: " + (req.validatedQuery?.length || 0) + ")";

    console.error(`[/api/research] Request failed for query: "${sanitizedQuery}"`);
    console.error(`- RequestID: ${req.id}`);
    console.error(`- IP: ${clientIp}`);
    console.error(`- Error: ${err.message}`);

    next(err);
  }
});

module.exports = router;
