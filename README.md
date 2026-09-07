# RunRank React — Race pace calculator on Clever Cloud

> A React 18 + Vite 8 + TypeScript running pace calculator deployed as a **Static** app on Clever Cloud. No server, no remote build: the Vite build is committed in `dist/` and served as-is.

---

## Deploy on Clever Cloud

1. Fork this repository
2. Run the build locally: `npm run build` (output goes to `dist/`)
3. Commit the build output: `git add . && git commit -m "build: production"`
4. In the Clever Cloud console, create a new **Static** application — connect your forked repo
5. Point the Static runtime at the build folder (once, with [clever-tools](https://www.clever.cloud/developers/doc/cli/)):
   ```bash
   clever env set CC_WEBROOT /dist
   ```
6. Push → Clever Cloud serves `dist/` automatically

> **Note:** the Static runtime does not read `clevercloud/static.json`; the served folder is set with the `CC_WEBROOT` environment variable (relative to the repo root, default `/`). See the [Static runtime documentation](https://www.clever.cloud/developers/doc/applications/static/).

---

## Stack

| Layer     | Technology          |
|-----------|---------------------|
| Framework | React 18            |
| Build     | Vite 8              |
| Language  | TypeScript 6        |
| Styles    | Tailwind CSS 4 + `src/styles/cc-brand.css` |
| Icons     | lucide-react        |
| Design    | Clever Brand Kit (Plus Jakarta Sans, navy #13172e, dégradé Clever) |

---

## Features

- Running pace calculator: enter distance and time, get min/km pace
- Rank assignment from Iron to Challenger (League of Legends–style tiers)
- Percentile display for each rank
- Clever Cloud brand chrome: top bar, hero, **certification block**, Static runtime panel, footer
- Fully responsive — mobile-first, no horizontal scroll at 375 px

---

## Certification Clever Cloud

The demo puts the [Clever Cloud Academy](https://academy.clever.cloud/) front and centre, right under the calculator: two official tracks (**Cloud Computing Fundamentals**, **Advanced Deployment**) and a digital badge delivered automatically on validation.

→ https://academy.clever.cloud/

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
npm run build          # → dist/index.html + dist/assets/
npm run preview        # optional: serve dist/ locally
git add .
git commit -m "build: production"
git push
```

> **Always run `npm run build` before pushing.** The Static runtime serves the committed `dist/` folder; without a fresh build, Clever Cloud keeps serving the previous version.

---

## Environment Variables

| Variable     | Value   | Purpose |
|--------------|---------|---------|
| `CC_WEBROOT` | `/dist` | Folder served by the Static runtime (set once on the app) |

The app itself needs no environment variable: everything is computed in the browser.

---

## Project layout

```
index.html                              → Vite source entry (head snippet + /src/main.tsx)
src/app/App.tsx                         → page: topbar, hero, calculator, certification, Static panel, footer
src/app/components/clever/              → Clever Brand Kit components (logo, badge, topbar, cert, footer)
src/app/components/                     → DistanceSelector, ResultCard, RankBadge (rank colours kept)
src/app/utils/calculations.ts           → pace, rank and percentile logic
src/styles/cc-brand.css                 → shared Clever Brand Kit (copied as-is, do not edit)
src/styles/index.css                    → demo-specific styles (rr-* classes)
dist/                                   → committed production build served by Clever Cloud
```

---

## Deployment Notes

- `vite.config.ts` sets `build.outDir: 'dist'` with `emptyOutDir: true`
- `dist/` is **committed** on purpose (no build step on the Static runtime)
- `CC_WEBROOT=/dist` must be set on the Clever Cloud application you deploy to, whatever its id (`clever env set CC_WEBROOT /dist`, or Console → *Environment variables*)
- Design spec: `docs/superpowers/specs/2026-09-06-clever-brand-design.md`
