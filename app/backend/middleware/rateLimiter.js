const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_HOURS, 10) || 24) * 60 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const resetTime = new Date(req.rateLimit.resetTime);
    res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: "Você atingiu o limite diário de pesquisas. Tente novamente amanhã.",
      retryAfter: resetTime.toISOString(),
    });
  },
});

module.exports = rateLimiter;
