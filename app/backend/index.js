require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");
const researchRoute = require("./routes/research.route");

const app = express();
const PORT = process.env.PORT || 5000;
const isDebug = process.env.LOG_LEVEL === "debug";

// ── CORS ─────────────────────────────────────────────────────────────────────
// Supports comma-separated list: e.g. "http://localhost:3000,http://localhost:3005"
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const err = new Error(`CORS policy: origin '${origin}' not allowed`);
      err.status = 403;
      err.code = "FORBIDDEN";
      callback(err);
    },
  })
);

// ── Trust Proxy ───────────────────────────────────────────────────────────────
const TRUST_PROXY = process.env.TRUST_PROXY || "false";
if (TRUST_PROXY === "true" || TRUST_PROXY === "1") {
  app.set("trust proxy", true);
} else if (TRUST_PROXY === "false" || TRUST_PROXY === "0") {
  app.set("trust proxy", false);
} else {
  const hops = parseInt(TRUST_PROXY, 10);
  if (!isNaN(hops)) app.set("trust proxy", hops);
}

app.use(express.json());

// ── Request ID ────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || randomUUID();
  res.setHeader("X-Request-Id", req.id);
  if (isDebug) {
    console.log(`[REQ] ${req.method} ${req.path} | origin: ${req.headers.origin || "—"} | id: ${req.id}`);
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sovereign AI backend is running", port: PORT });
});

app.use("/api", researchRoute);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  if (isDebug) console.error('DEBUG GLOBAL ERROR:', { status, code, name: err.name, message: err.message });
  console.error(`[ERROR] ${code} (${status}): ${err.message}`);
  if (isDebug) console.error(err.stack);
  res.status(status).json({ error: code, message: err.message || "Erro interno. Tente novamente." });
});

// ── Startup ───────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║         🚀 Sovereign AI — Backend Online         ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║  Port          : ${String(PORT).padEnd(31)}║`);
    console.log(`║  Log Level     : ${String(process.env.LOG_LEVEL || "info").padEnd(31)}║`);
    console.log(`║  Rate limit    : ${String(`${process.env.RATE_LIMIT_MAX || 5} req / ${process.env.RATE_LIMIT_WINDOW_HOURS || 24}h`).padEnd(31)}║`);
    console.log(`║  API Key set   : ${String(process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ No").padEnd(31)}║`);
    console.log("╠══════════════════════════════════════════════════╣");
    allowedOrigins.forEach((o, i) => {
      const label = i === 0 ? "CORS Origins  " : "              ";
      console.log(`║  ${label}: ${String(o).padEnd(29)}║`);
    });
    console.log("╚══════════════════════════════════════════════════╝");
  });
}

module.exports = app;
