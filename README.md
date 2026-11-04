# RunRank, the Race Pace Calculator — Static runtime on Clever Cloud

> Type a distance and a time: your pace shows up in huge type, a rank track from Iron to Challenger places you against the club's goal pace, and a race bib shows which instance served the page. React 18, Vite 8 and TypeScript, built on your machine and committed in `dist/`: the **Clever Cloud Static runtime** serves it as-is, with no remote build and no application process. The environment variables still reach the page: a pre-run hook writes them into `config.json` before every start, and a `Caddyfile` adds the security headers the default server cannot set.

![The calculator run locally: a 10 km in 48:30 is 4:51 /km, Platinum on the rank track, and the race bib with its default values](docs/screenshot-desktop.png)

<img src="docs/screenshot-phone.png" alt="A share link opened on a phone, run locally: a marathon in 2:59:30 is 4:15 /km, Diamond" width="300">

**Run it yourself.** The hosted demo was taken down after the presales review (November 2026). The steps in [Deploy on Clever Cloud](#deploy-on-clever-cloud) recreate it from scratch in about 2 minutes.

## What the Static runtime does here

| Where | Clever feature | What you see |
|---|---|---|
| `dist/` | Static runtime, `CC_WEBROOT=/dist` | The committed Vite build, served as-is. Without `CC_WEBROOT`, the repo root and its source `index.html` are served: a blank page |
| Every start, deploy and `clever restart` | `CC_PRE_RUN_HOOK=./scripts/write-config.sh` ("This hook runs every time", hooks documentation) writes the app's variables to `dist/config.json` | The bib, the banner, the club name and the goal flag follow the console; the bib footer says « config.json écrit par CC_PRE_RUN_HOOK à hh:mm:ss » |
| Web server | The `Caddyfile` at the repo root, detected by the Static runtime and run (`caddy run`) instead of the default server (SWS), which cannot set HTTP headers | CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, no `Server` header; long cache on the hashed `dist/assets/` files only, `index.html` and `config.json` in `no-cache` |
| Restart from the build cache | `CC_OVERRIDE_BUILDCACHE=dist:scripts:Caddyfile` | The hook script and the `Caddyfile` are still there after a `clever restart` (checked in production on 2026-10-25, deploy and restart) |
| Deploy | `CC_HEALTH_CHECK_PATH=/config.json`, `CC_GIT_FULL_CLONE=false` | The deployment is validated once `config.json` is served; the repo is cloned with `--depth 1`, so the history of `dist/` does not slow it down |

The Static runtime does **not** read `clevercloud/static.json`: the served folder is set with the `CC_WEBROOT` environment variable (relative to the repo root, default `/`). See the [Static runtime documentation](https://www.clever.cloud/developers/doc/applications/static/).

## Deploy on Clever Cloud

You need [clever-tools](https://www.clever.cloud/developers/doc/cli/) (`clever login` done) and the ID of the organisation that will own the resources (`orga_…`, shown in the Console). Run the commands from the repo root: `clever create` links the folder to the new app. The build is already committed in `dist/`; after a change, run `npm run build` and commit `dist/` before deploying, or Clever Cloud keeps serving the previous version.

```bash
# 1. The app and its size (Static: nothing is built on Clever Cloud)
clever create --type static demo-react-vite --org <org_id> --region par
clever scale --min-flavor nano --max-flavor XS --min-instances 1 --max-instances 2

# 2. Variables
clever env set CC_WEBROOT /dist                                # folder served
clever env set CC_PRE_RUN_HOOK ./scripts/write-config.sh       # env vars -> dist/config.json, on every start
clever env set CC_OVERRIDE_BUILDCACHE dist:scripts:Caddyfile   # keep the hook script and the Caddyfile for restarts
clever env set CC_HEALTH_CHECK_PATH /config.json
clever env set CC_GIT_FULL_CLONE false                         # shallow clone, faster deploys

# 3. Deploy
clever deploy
clever open
```

No add-on. To show the variables live, then `clever restart` and reload: the banner appears, the club name changes on the bib, the goal flag moves (« encore 21 s/km à gagner » for the default 10 km in 48:30) and the pill turns to `production`.

```bash
clever env set ANNOUNCEMENT "Démo live"
clever env set CLUB_NAME "Les Foulées Nantaises"
clever env set GOAL_PACE 4:30
clever env set APP_ENV production
clever restart
```

## Variables

| Variable | Set by | Role |
|---|---|---|
| `CC_WEBROOT` | you | `/dist`, the folder served |
| `CC_PRE_RUN_HOOK` | you | `./scripts/write-config.sh`: writes `dist/config.json` before every start |
| `CC_OVERRIDE_BUILDCACHE` | you | `dist:scripts:Caddyfile`: with `CC_WEBROOT` set, the build cache keeps only the served folder and a few configuration files, so the hook and the `Caddyfile` must be listed |
| `CC_HEALTH_CHECK_PATH` | you | `/config.json` |
| `CC_GIT_FULL_CLONE` | you | `false`: clone with `--depth 1` |
| `APP_ENV` | optional, default `local` | Environment pill on the bib (solid navy when `production`) |
| `ANNOUNCEMENT` | optional, empty | Gradient banner under the top bar |
| `CLUB_NAME` | optional, default `RunRank Club` | Bib header and goal sentence |
| `GOAL_PACE` | optional, default `5:00` | Goal flag on the rank track, goal sentence (held, or s/km to gain), target time on the pace band. `m:ss` between 2:00 and 12:00; anything else falls back to the default and the bib says the value was ignored |

A static app cannot read environment variables in the browser: the hook copies them into `dist/config.json` and the app fetches it with `cache: "no-store"`. Missing or invalid file: safe defaults, the page still renders. The bib also shows `INSTANCE_NUMBER`, `CC_PRETTY_INSTANCE_NAME`, `CC_APP_NAME`, `INSTANCE_TYPE`, `CC_COMMIT_ID` and `CC_DEPLOYMENT_ID`; `APP_ID` switches the *Live on Clever Cloud* pill. Locally they read « injecté au déploiement ».

## Routes

`/` the calculator; share link `?d=<5|10|21.0975|42.195>&t=<h:mm:ss>` (default 10 km in 48:30) · `/config.json` written by the hook, also the health check · `/assets/*` hashed Vite files, cached for a year. Anything else answers 404 (Caddy).

## Code tour

```
index.html                     Vite source entry (head snippet + /src/main.tsx)
src/app/App.tsx                page: top bar, banner, pace + rank track + bib, certification, variables, footer
src/app/config.ts              reads /config.json (no-store), parsing and defaults
src/app/utils/calculations.ts  pace, rank and percentile logic
src/app/components/            DistanceSelector, PaceTrack, RaceBib, RankBadge
src/app/components/clever/     Clever Brand Kit components (logo, badge, top bar, certification, footer)
src/styles/cc-brand.css        shared Clever Brand Kit (copied as-is, do not edit)
src/styles/index.css           demo styles (rr-* classes)
public/config.json             default config, copied to dist/
scripts/write-config.sh        CC_PRE_RUN_HOOK: env vars -> dist/config.json (POSIX sh, no dependency)
Caddyfile                      web server: serves dist/ only, security headers, cache rules
dist/                          committed production build served by Clever Cloud
```

React 18, Vite 8, TypeScript 6, Tailwind CSS 4, lucide-react. `vite.config.ts` sets `build.outDir: 'dist'` with `emptyOutDir: true`.

## Run locally

```bash
npm install
npm run dev                    # http://localhost:5173
npm run build                  # dist/index.html + dist/assets/, then commit dist/
```

Test the variables on the built app, then restore the default `dist/config.json` before committing:

```bash
APP_ENV=production GOAL_PACE=4:30 sh scripts/write-config.sh && npx vite preview --port 8102
npm run build
```

Requires Node.js 20+. The screenshots above come from the committed `dist/` served locally (hence « Local · hors Clever Cloud » and the default values on the bib).

## License

[MIT](LICENSE) © 2026 [Vitiosum](https://github.com/Vitiosum)
