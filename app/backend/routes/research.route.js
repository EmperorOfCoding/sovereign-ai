const express = require("express");
const rateLimiter = require("../middleware/rateLimiter");
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
 * Body: { query: string }
 * Returns: { success: true, data: AnalysisResult } | error
 */
router.post("/research", validateQuery, rateLimiter, async (req, res) => {
  try {
    const data = await analyzeMarket(req.validatedQuery);
    return res.json({ success: true, data });
  } catch (err) {
    const clientIp = req.headers["x-forwarded-for"] || req.ip;
    const sanitizedQuery = (req.validatedQuery || "").substring(0, 20) + "... (len: " + (req.validatedQuery?.length || 0) + ")";
    
    console.error(`[/api/research] Request failed for query: "${sanitizedQuery}"`);
    console.error(`- RequestID: ${req.id}`);
    console.error(`- IP: ${clientIp}`);
    console.error(`- Error: ${err.message}`);
    console.error(`- Stack: ${err.stack}`);

    return res.status(500).json({
      error: "ANALYSIS_FAILED",
      message: "Erro ao processar a análise. Tente novamente.",
    });
  }
});

module.exports = router;
