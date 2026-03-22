require("dotenv").config();
const express = require("express");
const cors = require("cors");
const researchRoute = require("./routes/research.route");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.set("trust proxy", 1); // trust X-Forwarded-For from reverse proxies and tests
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sovereign AI backend is running" });
});

app.use("/api", researchRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
