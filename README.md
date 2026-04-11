# RunRank React — Race pace calculator on Clever Cloud

> A React 18 + Vite + TypeScript running pace calculator deployed as a static app on Clever Cloud. No server required.

---

## Deploy on Clever Cloud

1. Fork this repository
2. Run the build locally: `npm run build` (output goes to the repo root)
3. Commit the build output: `git add . && git commit -m "build: production"`
4. In the Clever Cloud console, create a new **Static** application — connect your forked repo
5. Push → Clever Cloud serves the static files automatically

> **Note:** The Vite build outputs directly to the repository root (`outDir: '.'` in `vite.config.ts`). No `dist/` folder — Clever Cloud serves from root.

---

## Stack

| Layer     | Technology          |
|-----------|---------------------|
| Framework | React 18            |
| Build     | Vite 6              |
| Language  | TypeScript          |
| Styles    | Tailwind CSS 4      |
| UI        | shadcn/ui           |
| Icons     | lucide-react        |
| Design    | Nexus AI (blue #3b82f6, dark background) |

---

## Features

- Running pace calculator: enter distance and time, get min/km pace
- Rank assignment from Iron to Challenger (League of Legends–style tiers)
- Percentile display for each rank
- Nexus AI design system — dark blue UI with animated shiny CTA
- Fully responsive — mobile-first

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Run

```bash
git clone https://github.com/Vitiosum/demo-react-vite
cd demo-react-vite
npm install
npm run dev
# → http://localhost:5173
```

### Build for deployment

```bash
npm run build
git add .
git commit -m "build: production"
git push
```

---

## Environment Variables

No environment variables required.

---

## Deployment Notes

- `vite.config.ts` sets `build.outDir: '.'` — the build outputs directly to the repo root, not a `dist/` folder
- Clever Cloud Static runtime serves files from the repository root
- Always run `npm run build` and commit the output before pushing to trigger a new deployment
