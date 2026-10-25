# RunRank React — Race pace calculator on Clever Cloud

> A React 18 + Vite 8 + TypeScript running pace calculator deployed as a **Static** app on Clever Cloud. No server, no remote build: the Vite build is committed in `dist/` and served as-is.

---

## Deploy on Clever Cloud

1. Fork this repository
2. Run the build locally: `npm run build` (output goes to `dist/`)
3. Commit the build output: `git add . && git commit -m "build: production"`
4. Create a **Static** application with clever-tools (`clever create --type static`). There is no GitHub link: `clever create --github` is refused by the API ("wrong oauth application data"; the account's GitHub integration must be reconnected in the Console)
5. Set the runtime variables once (with [clever-tools](https://www.clever.cloud/developers/doc/cli/)):
   ```bash
   clever env set CC_WEBROOT /dist                              # folder served
   clever env set CC_PRE_RUN_HOOK ./scripts/write-config.sh     # env vars -> dist/config.json, on every start
   clever env set CC_OVERRIDE_BUILDCACHE dist:scripts           # keep the hook script in the build cache (restarts)
   clever env set CC_HEALTH_CHECK_PATH /config.json
   clever env set CC_GIT_FULL_CLONE false                       # shallow clone, faster deploys
   ```
6. `git push` (GitHub backup), then `clever deploy` → Clever Cloud serves `dist/`. A plain `git push` does not redeploy.

Live app from 2026-10-25 to 2026-11-05 (deletion planned after the 2026-11-04 video shoot): `app_c7280242-2f19-405a-a449-4d8f6468f0e7`, https://app-c7280242-2f19-405a-a449-4d8f6468f0e7.cleverapps.io/. After that date, recreate it with the procedure above.

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

- Live pace calculator: the first screen shows your pace in huge type, updated as you type
- Rank track: 9 lanes from Iron to Challenger, your marker and the club goal flag (`GOAL_PACE`)
- Pace band (split times) and a race bib showing the Clever Cloud instance that served the page
- Shareable link: `?d=42.195&t=2:59:30`
- Clever Cloud chrome: top bar, `ANNOUNCEMENT` banner, **certification block** right under the first screen, footer
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
git push               # GitHub backup only
clever deploy          # deploys main to Clever Cloud (no GitHub link: push alone does not redeploy)
```

> **Always run `npm run build` before deploying.** The Static runtime serves the committed `dist/` folder; without a fresh build, Clever Cloud keeps serving the previous version.

---

## Environment Variables

A static app cannot read environment variables in the browser. On Clever Cloud, `scripts/write-config.sh`
runs as `CC_PRE_RUN_HOOK` ("This hook runs every time", hooks documentation) and writes `dist/config.json`;
the app fetches it with `cache: "no-store"`. Missing or invalid file: safe defaults.

| Variable | Default | Visible effect |
|----------------|----------------|----------------|
| `APP_ENV` | `local` | environment pill on the bib (white when `production`) |
| `ANNOUNCEMENT` | empty | gradient banner under the top bar |
| `CLUB_NAME` | `RunRank Club` | bib header and goal sentence |
| `GOAL_PACE` | `5:00` | goal flag on the rank track, "goal reached / s/km to gain", target time (`m:ss`, 2:00–12:00) |

Platform variables shown on the bib: `INSTANCE_NUMBER`, `CC_PRETTY_INSTANCE_NAME`, `CC_APP_NAME`, `INSTANCE_TYPE`,
`CC_COMMIT_ID`, `CC_DEPLOYMENT_ID` (`APP_ID` switches the "Live on Clever Cloud" pill).

Change a variable in the console, run `clever restart`, reload: the page reflects it.

Local test: `APP_ENV=production GOAL_PACE=4:30 sh scripts/write-config.sh && npx vite preview --port 8102`
(run `npm run build` afterwards to restore the default `dist/config.json`).

---

## Project layout

```
index.html                              → Vite source entry (head snippet + /src/main.tsx)
src/app/App.tsx                         → page: topbar, banner, pace + rank track + bib, certification, variables, footer
src/app/config.ts                       → reads /config.json (no-store), parsing and defaults
scripts/write-config.sh                 → CC_PRE_RUN_HOOK: env vars -> dist/config.json (POSIX sh, no dependency)
public/config.json                      → default config copied to dist/
src/app/components/clever/              → Clever Brand Kit components (logo, badge, topbar, cert, footer)
src/app/components/                     → DistanceSelector, PaceTrack, RaceBib, RankBadge (rank colours kept)
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

## Security and web server

The Static runtime's default server (SWS) cannot set HTTP headers. The root `Caddyfile` is detected by the runtime and run (`caddy run`) instead: it serves `dist/` only, sets CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, drops the `Server` header, caches only hashed `dist/assets/` files long-term and serves `index.html`/`config.json` with `no-cache`. Keep it in `CC_OVERRIDE_BUILDCACHE` (`dist:scripts:Caddyfile`) so a `clever restart` from the build cache still has it.

