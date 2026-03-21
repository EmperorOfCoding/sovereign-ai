# Sovereign AI

**Sovereign AI** is an intelligent platform designed to validate market ideas by identifying real market pain points, gathering evidence, and analyzing relevant data. It delivers actionable insights through key indicators, enabling more informed and strategic decision-making.

## 🚀 Features

- **Market Validation**: Evaluate the viability of your business ideas.
- **Pain Point Identification**: Discover and analyze real market problems.
- **Evidence Gathering**: Collect and organize relevant data to support your analysis.
- **Key Indicators**: Get actionable insights to guide your decisions.
- **AI-Powered Analysis**: Leverage artificial intelligence to process information and generate insights.
- **Modern Landing Page**: A fully responsive landing page implemented with Next.js, Tailwind CSS (including custom plugins like `@tailwindcss/container-queries` and `@tailwindcss/forms`), using `Space Grotesk` fonts and `Material Symbols`.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Shadcn UI
- **Icons**: Lucide React

## 📂 Project Structure

```text
sovereign-ai/
├── app/
│   ├── frontend/           # Next.js App Router (Frontend)
│   │   ├── app/            # Pages and layouts
│   │   ├── components/     # Reusable React components
│   │   ├── lib/            # Utility functions
│   │   ├── public/         # Static assets
│   │   ├── styles/         # Global styles
│   │   ├── package.json    # Frontend dependencies
│   │   └── ...
│   └── backend/            # Backend Server / API
│       ├── index.js        # Main server entry
│       ├── package.json    # Backend dependencies
│       └── ...
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

3. Create a `.env.local` file in the frontend directory:
   ```bash
   cd ../frontend
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   # Add your API keys and other environment variables here
   ```

### Development

Start the development servers:

```bash
# In app/frontend
npm run dev

# In app/backend
npm start
```

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 📝 Development Notes

### IDE Configuration (jsconfig.json)
To prevent VS Code (or other IDEs) from unnecessarily parsing and validating third-party packages inside `node_modules` — which can lead to false positive errors like `File '@ljharb/tsconfig' not found` — we maintain `jsconfig.json` configurations:
- `app/backend/jsconfig.json`: Marks the backend as an isolated JavaScript project, instructing the IDE to ignore its `node_modules`.
- `/jsconfig.json` (Root): A global fallback configuration that ignores `node_modules` across the entire workspace.

### Frontend Architecture
- **CSS Architecture**: We strictly use CSS Variables for our colors defined in `globals.css` and map them into the custom configuration in `tailwind.config.ts`.
- **Landing Page Integration**: The main landing page is defined in `app/page.tsx`, functioning as a Client Component to manage scroll intersection reveal effects globally (`revealOnScroll`).
- **Typography**: We use `Space Grotesk` customized inside the Next.js `layout.tsx` to prevent cumulative layout shift, leveraging `next/font/google`.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## 👥 Team

- [Your Name/Team Name]

## 📞 Contact

For questions or support, please contact [suporte@sovereign-ai.com](mailto:suporte@sovereign-ai.com).

## 📄 Acknowledgments

- Built with Next.js 14
- Tailwind CSS for styling
- Shadcn UI for components
- TanStack Query for data fetching

---

**Built with ❤️ using Next.js 14**
