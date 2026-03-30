# Sovereign AI

**Sovereign AI** is an intelligent platform designed to validate market ideas by identifying real market pain points, gathering evidence, and analyzing relevant data. It delivers actionable insights through key indicators, enabling more informed and strategic decision-making.

## 🚀 Features

- **Market Validation**: Evaluate the viability of your business ideas.
- **Pain Point Identification**: Discover and analyze real market pain points.
- **Evidence Gathering**: Collect and organize relevant data to support your analysis.
- **Key Indicators**: Get actionable insights to guide your decisions.
- **AI-Powered Analysis**: Powered by `anthropic/claude-sonnet-4.5` via OpenRouter with token-optimized prompts.
- **IP-Based Rate Limiting**: 5 requests per IP per 24h to control API costs before user accounts are active.
- **Modern Landing Page**: Fully responsive, built with Next.js and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with **Turbopack**, React 18, TypeScript
- **Backend**: Node.js + Express 5, layered architecture (middleware/services/routes)
- **AI**: OpenRouter API → `anthropic/claude-sonnet-4.5`
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
│   │   ├── styles/         # Global styles (CSS variables)
│   │   ├── .env.local      # NEXT_PUBLIC_BACKEND_URL
│   │   └── package.json
│   └── backend/            # Express API
│       ├── middleware/
│       │   └── rateLimiter.js  # IP-based rate limiting
│       ├── routes/
│       │   └── research.route.js
│       ├── services/
│       │   └── openrouter.service.js
│       ├── tests/
│       │   └── research.test.js
│       ├── index.js
│       ├── .env             # OPENROUTER_API_KEY (never committed)
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

**Test coverage:**
- ✅ Valid query returns 200 with correct shape
- ✅ Empty / missing query returns 400
- ✅ Query > 500 chars returns 400
- ✅ Same IP 4th request returns 429 (RATE_LIMIT_MAX = 3)
- ✅ Upstream API failure returns 500

## 📝 Development Notes

### IDE Configuration (jsconfig.json)

To prevent VS Code from unnecessarily parsing `node_modules`, we maintain `jsconfig.json` files:
- `app/backend/jsconfig.json`: Isolates the backend as a JavaScript project.
- `/jsconfig.json` (Root): Global fallback that ignores `node_modules` workspace-wide.

### Backend Architecture

- **Layered design**: `middleware/` → `routes/` → `services/` — each layer has a single responsibility.
- **Validation before rate limiting**: Input is validated in a middleware that runs *before* the rate limiter, so invalid requests never consume quota.
- **Token optimization**: The OpenRouter service uses `max_tokens: 700`, `temperature: 0`, and a JSON-only system prompt to minimize costs per call.
- **Security**: The `OPENROUTER_API_KEY` lives only in the backend `.env` (gitignored). The frontend never sees it.

### Frontend Architecture

- **CSS Architecture**: CSS Variables for all colors defined in `globals.css`.
- **Landing Page**: `app/page.tsx` is a Client Component. The `SearchResultsModal` calls the backend API and handles real AI responses, rate-limit errors, and network failures.
- **Typography**: `Space Grotesk` via `next/font/google` to prevent layout shift.

### Recent Enhancements (March 2026)

- **OpenRouter Integration**: Connected to `anthropic/claude-sonnet-4.5` via OpenRouter for real market analysis.
- **IP Rate Limiting**: 5 requests/IP/24h via `express-rate-limit` to protect API credits before user accounts exist.
- **TDD**: All backend endpoints covered with Jest + Supertest (6 tests, 0 real API calls).
- **Advanced Interactive UI**: High-fidelity animations using `motion` (Framer Motion). Enhanced search modal, interactive roadmap with staggered reveals.
- **UI Performance & Sequencing**: Fixed issues where primary CTA buttons would appear before the page content was fully animated/loaded by implementing sequenced entrance animations.
- **Turbopack Integration**: Enabled Next.js Turbopack for local development, reducing start times and HMR (Hot Module Replacement) latency.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## 👥 Team

- [Your Name/Team Name]

## 📞 Contact

For questions or support, please contact [suporte@sovereign-ai.com](mailto:suporte@sovereign-ai.com).

## 💡 Acknowledgments

- **OpenRouter** for providing access to Claude 3.5 Sonnet.
- **Framer Motion** for the advanced UI micro-interactions.
- **Custom CSS Variables** for the flexible design system.
- **Lucide React** for the consistent icon set.

---

**Built with ❤️ using Next.js 14**
