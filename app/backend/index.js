require("dotenv").config();
const express = require("express");
const cors = require("cors");
const researchRoute = require("./routes/research.route");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: FRONTEND_ORIGIN }));
// Trust Proxy configuration (for correct IP detection behind proxies)
const TRUST_PROXY = process.env.TRUST_PROXY || "false";
if (TRUST_PROXY === "true" || TRUST_PROXY === "1") {
  app.set("trust proxy", true);
} else if (TRUST_PROXY === "false" || TRUST_PROXY === "0") {
  app.set("trust proxy", false);
} else {
  const hops = parseInt(TRUST_PROXY, 10);
  if (!isNaN(hops)) {
    app.set("trust proxy", hops);
  }
}
app.use(express.json());

// Request ID Middleware
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || require("crypto").randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sovereign AI backend is running" });
});

app.use("/api", researchRoute);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
