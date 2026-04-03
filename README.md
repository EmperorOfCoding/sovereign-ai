# Sovereign AI

**Sovereign AI** is an intelligent platform designed to validate market ideas by identifying real market pain points, gathering evidence, and analyzing relevant data. It delivers actionable insights through key indicators, enabling more informed and strategic decision-making.

## 🚀 Features

- **Market Validation**: Evaluate the viability of your business ideas.
- **Pain Point Identification**: Discover and analyze real market pain points.
- **Evidence Gathering**: Real data from user complaints and market research via Tavily API.
- **Raw Signal Display**: Traceable sources with clickable URLs for direct verification.
- **Key Indicators**: Get actionable insights to guide your decisions.
- **AI-Powered Analysis**: Primary model `google/gemini-2.5-flash` via OpenRouter (fast, cost-effective) with automatic fallback to `anthropic/claude-sonnet-4.6` for complex cases.
- **Query Optimization**: Uses `google/gemini-2.0-flash-lite` for fast, cost-effective prompt rewriting.
- **IP-Based Rate Limiting**: 5 requests per IP per 24h to control API costs before user accounts are active.
- **Modern Landing Page**: Fully responsive, built with Next.js and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with **Turbopack**, React 18, TypeScript
- **Backend**: Node.js + Express 5, layered architecture (middleware/services/routes)
- **AI**: OpenRouter API → `google/gemini-2.5-flash` (Primary Analysis) + `anthropic/claude-sonnet-4.6` (Fallback) + `google/gemini-2.0-flash-lite` (Rewriter)
- **Rate Limiting**: `express-rate-limit` (IP-based)
- **Testing**: Jest + Supertest
- **Styling**: Custom CSS Variables + Framer Motion
- **Icons**: Lucide React

## 📂 Project Structure

```text
sovereign-ai/
├── app/
│   ├── frontend/           # Next.js App Router (Frontend)
│   │   ├── app/            # Pages and layouts
│   │   ├── components/     # React components (SearchResultsModal, Verdict, etc.)
│   │   ├── styles/         # Global styles (CSS variables)
│   │   ├── types/          # TypeScript types (AnalysisResult, RawEvidence)
│   │   ├── .env.local      # NEXT_PUBLIC_BACKEND_URL
│   │   └── package.json
│   └── backend/            # Express API
│       ├── middleware/
│       │   └── rateLimiter.js      # IP-based rate limiting
│       ├── routes/
│       │   └── research.route.js   # 3-step pipeline orchestration
│       ├── services/
│       │   ├── openrouter.service.js  # AI analysis (Claude via OpenRouter)
│       │   ├── query-rewriter.service.js  # Query optimization (cheap model)
│       │   └── tavily.service.js   # Real evidence collection (Tavily API)
│       ├── tests/
│       │   └── research.test.js
│       ├── index.js
│       ├── .env             # API keys (never committed)
│       └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sovereign-ai
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Frontend
   cd app/frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```


3. Create `.env` in the **backend** directory:

   ```env
   # app/backend/.env  — NEVER commit this file
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   PORT=5000
   RATE_LIMIT_MAX=5
   RATE_LIMIT_WINDOW_HOURS=24
   FRONTEND_ORIGIN=http://localhost:3000
   ```


4. Create `.env.local` in the **frontend** directory:

   ```env
   # app/frontend/.env.local
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

### Development

Start the development servers:

```bash
# In app/backend
npm start

# In app/frontend
npm run dev
```

## 🧪 Testing

```bash
# In app/backend (mocked — no API credits spent)
npm test
npm run test:coverage
```

**Test coverage (9 tests):**
- ✅ Valid query returns 200 with correct shape (primary model: Gemini 2.5 Flash)
- ✅ Empty / missing query returns 400
- ✅ Query > 500 chars returns 400
- ✅ Same IP 4th request returns 429 (RATE_LIMIT_MAX = 3)
- ✅ Upstream API failure (both models) returns 500
- ✅ `rawEvidences` field present in successful response
- ✅ Pipeline succeeds (fallback to `[]`) when Tavily returns no results
- ✅ Gemini fails → fallback to Claude succeeds (3 fetch calls)

## 📝 Development Notes

### IDE Configuration (jsconfig.json)

To prevent VS Code from unnecessarily parsing `node_modules`, we maintain `jsconfig.json` files:
- `app/backend/jsconfig.json`: Isolates the backend as a JavaScript project.
- `/jsconfig.json` (Root): Global fallback that ignores `node_modules` workspace-wide.

### Research Pipeline (3 Steps)

```
[User Input]
     │
     ▼
[1. Query Rewriter] → cheap model optimizes the raw input into a problem statement
     │
     ▼
[2. Tavily Service] → 2 parallel searches:
     │    ├── Complaints (Reddit, Reclame Aqui, forums, social media)
     │    └── Research (market studies, reports, industry data)
     │    └── Returns 0-20 deduplicated RawEvidence items with URLs
     │
     ▼
[3. OpenRouter / Gemini 2.5 Flash] → scores + verdict (primary, fast)
     │    └── On failure: fallback to Claude Sonnet (deeper reasoning)
     │
     ▼
[Frontend] → "Sinais Reais do Mercado" section + AI analysis
```

### Backend Architecture

- **Layered design**: `middleware/` → `routes/` → `services/` — each layer has a single responsibility.
- **Validation before rate limiting**: Input is validated in a middleware that runs *before* the rate limiter, so invalid requests never consume quota.
- **3-step pipeline**: Query Rewriter → Tavily Evidence Collection → OpenRouter Analysis.
- **Graceful degradation**: If Tavily is unavailable, `rawEvidences` returns `[]` and the Claude analysis still runs.
- **Token optimization**: The OpenRouter service uses `max_tokens: 800`, `temperature: 0`, and a JSON-only system prompt. Real Tavily evidences are injected as context to improve score accuracy.
- **Model strategy (Primary/Fallback)**: Gemini 2.5 Flash handles all analyses by default (fast, cost-effective). If it fails (HTTP error, timeout, JSON parse, validation), the service auto-retries with Claude Sonnet as fallback — no manual intervention needed.
- **Security**: API keys live only in the backend `.env` (gitignored). The frontend never sees them.

### Frontend Architecture

- **CSS Architecture**: CSS Variables for all colors defined in `globals.css`.
- **Landing Page**: `app/page.tsx` is a Server Component that composes high-fidelity client sections. The `SearchResultsModal` (client) calls the backend API and handles real AI responses, rate-limit errors, and network failures.

- **Typography**: `Space Grotesk` via `next/font/google` to prevent layout shift.

- **Tavily Evidence Integration (April 2026)**:
  - New `tavily.service.js` runs 2 parallel searches (complaints + research) via `@tavily/core`.
  - Up to 20 deduplicated, URL-traceable `RawEvidence` items returned per query.
  - New "Sinais Reais do Mercado" section in `SearchResultsModal` shows complaints (🔴) and research (🔵) in separate groups with clickable sources.
  - Claude analysis now receives real Tavily evidences as context, making scores data-grounded.
  - Graceful fallback: if Tavily fails, pipeline still completes with `rawEvidences: []`.
  - 2 new TDD tests (8 total): `rawEvidences` shape + fallback behavior.

- **OpenRouter Integration**: Primary model `google/gemini-2.5-flash` via OpenRouter for fast, cost-effective market analysis. Automatic fallback to `anthropic/claude-sonnet-4.6` for complex/ambiguous cases.
- **Query Rewriter**: Optimized with `google/gemini-2.0-flash-lite-001` for extreme speed and low cost (best cost-benefit).
- **IP Rate Limiting**: 5 requests/IP/24h via `express-rate-limit` to protect API credits before user accounts exist.
- **TDD**: All backend endpoints covered with Jest + Supertest (9 tests, 0 real API calls).
- **Advanced Interactive UI**: High-fidelity animations using `motion` (Framer Motion). Enhanced search modal, interactive roadmap with staggered reveals.
- **Accessibility & UX Fixes (April 2026)**:
  - **Focus Management**: Implemented full focus trapping and restoration in `SearchResultsModal` for improved screen reader and keyboard navigation.
  - **Enhanced Error Handling**: Improved 400 status error parsing to display specific backend error messages in the UI.
  - **Reduced Motion Support**: Optimized `Verdict` progress ring animations to respect system `prefers-reduced-motion` settings.
- **Sentry Monitoring Refactoring**:
  - Centralized traces sample rate normalization into a shared utility.
  - Fixed client-side Sentry configuration to correctly use `NEXT_PUBLIC_` environment variables.
- **UI Performance & Sequencing**: Fixed issues where primary CTA buttons would appear before the page content was fully animated/loaded by implementing sequenced entrance animations.
- **Turbopack Integration**: Enabled Next.js Turbopack for local development, reducing start times and HMR (Hot Module Replacement) latency.

- **UX & Model Improvements (April 2026 — v2)**:
  - **Terminal-style cursor**: Search input now has a green block caret, bold font, and green text selection matching the terminal aesthetic.
  - **Evidence dates**: Each raw evidence card shows the original publication date or collection timestamp (pt-BR format).
  - **Gemini primary model**: Analysis now uses `google/gemini-2.5-flash` as primary (fast/cheap), with automatic fallback to `anthropic/claude-sonnet-4.6` for failures.
  - **"Por que Sovereign AI?" section**: New comparative landing page section highlighting why Sovereign AI outperforms generic AI search tools (verifiable evidence, real pain focus, source traceability, decision support).
  - **New test**: Gemini→Claude fallback path verified in test suite (9 total tests).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## 👥 Team

- Empiricus

## 📞 Contact

For questions or support, please contact [suporte@sovereign-ai.com](victorameno@hotmail.com).

## 💡 Acknowledgments

- **OpenRouter** for providing access to Claude 3.5 Sonnet.
- **Framer Motion** for the advanced UI micro-interactions.
- **Custom CSS Variables** for the flexible design system.
- **Lucide React** for the consistent icon set.

---

**Built with ❤️ using Next.js 14**
