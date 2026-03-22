const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_HOURS, 10) || 24) * 60 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const resetTimeMs = req.rateLimit.resetTime ? new Date(req.rateLimit.resetTime).getTime() : 0;
    const now = Date.now();
    let retryAfter = 86400; // default 1 day fallback

    if (!isNaN(resetTimeMs) && resetTimeMs > now) {
      retryAfter = Math.max(0, Math.ceil((resetTimeMs - now) / 1000));
    }

    res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: "Você atingiu o limite diário de pesquisas. Tente novamente amanhã.",
      retryAfter,
    });
  },
});

module.exports = rateLimiter;
