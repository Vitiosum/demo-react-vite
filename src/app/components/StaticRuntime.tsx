import { useEffect, useState, type CSSProperties } from "react";
import type { Platform } from "../config";

const STATIC_DOC_URL = "https://www.clever.cloud/developers/doc/deploy/applications/static/";
const HOOKS_DOC_URL = "https://www.clever.cloud/developers/doc/develop/common-configuration/build-hooks/";
// Marqueur des requêtes HEAD de la page sur elle-même, exclues du photo-finish.
const PROBE = "homologation";

interface FileTiming {
  path: string;
  start: number;
  end: number;
  /** Octets reçus compressés, puis une fois décompressés. */
  encoded: number;
  decoded: number;
  /** 0 = servi par le cache du navigateur. */
  transfer: number;
}

// Ce que le navigateur a vraiment reçu de l'app : Resource Timing, même origine uniquement.
function readTimings(): FileTiming[] {
  const files: FileTiming[] = [];
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav) {
    files.push({ path: new URL(nav.name).pathname, start: nav.requestStart, end: nav.responseEnd, encoded: nav.encodedBodySize, decoded: nav.decodedBodySize, transfer: nav.transferSize });
  }
  for (const r of performance.getEntriesByType("resource") as PerformanceResourceTiming[]) {
    const url = new URL(r.name);
    if (url.origin !== location.origin || url.search.includes(PROBE)) continue;
    if (files.some((f) => f.path === url.pathname)) continue;
    files.push({ path: url.pathname, start: r.startTime, end: r.responseEnd, encoded: r.encodedBodySize, decoded: r.decodedBodySize, transfer: r.transferSize });
  }
  return files;
}

const HEADERS = [
  { name: "Content-Security-Policy", key: "content-security-policy" },
  { name: "Strict-Transport-Security", key: "strict-transport-security" },
  { name: "X-Content-Type-Options", key: "x-content-type-options" },
  { name: "X-Frame-Options", key: "x-frame-options" },
  { name: "Referrer-Policy", key: "referrer-policy" },
];

interface PageHeaders {
  page: Record<string, string | null>;
  server: string | null;
  pageCache: string | null;
  asset: { path: string; cache: string | null } | null;
}

// La page se demande ses propres en-têtes : HEAD sur elle-même et sur son bundle JS.
async function readHeaders(): Promise<PageHeaders> {
  const res = await fetch(`${location.pathname}?${PROBE}`, { method: "HEAD", cache: "no-store" });
  const script = document.querySelector<HTMLScriptElement>('script[type="module"][src]');
  let asset: PageHeaders["asset"] = null;
  if (script) {
    const url = new URL(script.src);
    const r = await fetch(`${url.pathname}?${PROBE}`, { method: "HEAD", cache: "no-store" });
    asset = { path: url.pathname, cache: r.headers.get("cache-control") };
  }
  return {
    page: Object.fromEntries(HEADERS.map((h) => [h.key, res.headers.get(h.key)])),
    server: res.headers.get("server"),
    pageCache: res.headers.get("cache-control"),
    asset,
  };
}

const ko = (bytes: number) => `${(bytes / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ko`;
const ms = (t: number) => `${Math.round(t)} ms`;

// config.json affiché : sans APP_ID, commit raccourci à 7 caractères.
function displayConfig(raw: Record<string, unknown>) {
  const { APP_ID: _appId, ...rest } = raw;
  void _appId;
  if (typeof rest.CC_COMMIT_ID === "string") rest.CC_COMMIT_ID = rest.CC_COMMIT_ID.slice(0, 7);
  return rest;
}

export function StaticRuntime({ platform }: { platform: Platform }) {
  const [files, setFiles] = useState<FileTiming[]>([]);
  const [headers, setHeaders] = useState<PageHeaders | null>(null);
  const [headersError, setHeadersError] = useState(false);

  useEffect(() => {
    let timer = 0;
    const read = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setFiles(readTimings()), 600);
    };
    if (document.readyState === "complete") read();
    else window.addEventListener("load", read, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", read);
    };
  }, [platform.source]);

  useEffect(() => {
    readHeaders().then(setHeaders, () => setHeadersError(true));
  }, []);

  const finish = Math.max(1, ...files.map((f) => f.end));
  const totalEncoded = files.reduce((s, f) => s + f.encoded, 0);
  const totalDecoded = files.reduce((s, f) => s + f.decoded, 0);
  const bundle = files.filter((f) => f.path.startsWith("/assets/"));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * finish);

  const checks = headers
    ? [
        ...HEADERS.map((h) => ({ name: h.name, value: headers.page[h.key], ok: !!headers.page[h.key] })),
        { name: "Server", value: headers.server ?? "absent", ok: !headers.server },
      ]
    : [];
  const homologated = checks.length > 0 && checks.every((c) => c.ok);

  return (
    <section id="static" className="rr-static" aria-labelledby="static-title">
      <div className="cc-container">
        <header className="rr-static__head">
          <h2 id="static-title">Ce que fait le runtime Static : servir des fichiers</h2>
          <p>
            Aucun processus Node, aucun build sur Clever Cloud : <span className="cc-kbd">dist/</span> est committé et Caddy le sert tel
            quel. Tout ce qui suit est mesuré par cette page, dans votre navigateur.
          </p>
        </header>

        <figure className="rr-finish">
          <figcaption>
            <h3>Photo-finish du chargement</h3>
            <p>
              {files.length > 0 ? (
                <>
                  {files.length} fichiers servis par l'app, {ko(totalEncoded)} reçus ({ko(totalDecoded)} une fois décompressés),
                  le dernier passe la ligne à {ms(finish)}.
                  {bundle.length > 0 && <> Le bundle Vite pèse {ko(bundle.reduce((s, f) => s + f.encoded, 0))} sur le réseau.</>}
                </>
              ) : (
                "Chronométrage en cours…"
              )}
            </p>
          </figcaption>
          <ol className="rr-finish__lanes">
            {files.map((f) => (
              <li key={f.path}>
                <span className="rr-finish__name">
                  <code>{f.path === "/" ? "/ (index.html)" : f.path}</code>
                  <small>
                    {f.encoded ? ko(f.encoded) : "taille non exposée"}
                    {f.transfer === 0 && f.encoded > 0 ? ", cache du navigateur" : ""}
                  </small>
                </span>
                <span className="rr-finish__lane">
                  <span className="rr-finish__streak" style={{ "--s": f.start / finish, "--e": f.end / finish } as CSSProperties} />
                </span>
                <span className="rr-finish__time">{ms(f.end)}</span>
              </li>
            ))}
          </ol>
          <div className="rr-finish__scale" aria-hidden="true">
            <span />
            <span className="rr-finish__ticks">
              {ticks.map((t, i) => (
                <i key={i} style={{ "--k": i / 4 } as CSSProperties}>{ms(t)}</i>
              ))}
            </span>
            <span />
          </div>
        </figure>

        <div className="rr-static__grid">
          <section className="rr-homolog" aria-labelledby="homolog-title">
            <h3 id="homolog-title">Homologation : les en-têtes posés par le Caddyfile</h3>
            <p>
              Un record n'est homologué que si les conditions sont réunies. Ici, la page lit ses propres en-têtes avec{" "}
              <code>fetch("{typeof location === "undefined" ? "/" : location.pathname}", {"{ method: \"HEAD\" }"})</code>.
            </p>
            {headersError && <p className="rr-homolog__error">Lecture impossible : la page ne répond pas à une requête HEAD.</p>}
            <ul className="rr-homolog__list">
              {checks.map((c) => (
                <li key={c.name} className={c.ok ? "is-ok" : "is-missing"}>
                  <span className="rr-homolog__mark" aria-hidden="true">{c.ok ? "✓" : "✗"}</span>
                  <b>{c.name}</b>
                  <code title={c.value ?? undefined}>{c.value ?? "absent"}</code>
                </li>
              ))}
              {headers && (
                <>
                  <li className="is-info">
                    <span className="rr-homolog__mark" aria-hidden="true">↻</span>
                    <b>Cache-Control de la page</b>
                    <code>{headers.pageCache ?? "absent"}</code>
                  </li>
                  {headers.asset && (
                    <li className="is-info">
                      <span className="rr-homolog__mark" aria-hidden="true">↻</span>
                      <b>Cache-Control de {headers.asset.path.replace("/assets/", "")}</b>
                      <code>{headers.asset.cache ?? "absent"}</code>
                    </li>
                  )}
                </>
              )}
            </ul>
            {headers && (
              <p className={homologated ? "rr-stamp is-ok" : "rr-stamp"} role="status">
                {homologated ? "Homologué" : "Non homologué : page servie sans le Caddyfile"}
              </p>
            )}
          </section>

          <section id="config" className="rr-startlist" aria-labelledby="config-title">
            <h3 id="config-title">La feuille de départ : vos variables, écrites avant chaque départ</h3>
            <p>
              Le navigateur ne voit pas les variables de l'app. Avant chaque démarrage, Clever Cloud lance{" "}
              <span className="cc-kbd">CC_PRE_RUN_HOOK</span> : un script shell écrit <span className="cc-kbd">dist/config.json</span>, que
              React lit sans cache. Changez <span className="cc-kbd">GOAL_PACE</span> dans la console, faites un{" "}
              <span className="cc-kbd">clever restart</span>, rechargez : les feux de cadence changent d'allure.
            </p>
            <ol className="rr-flow">
              <li><b>Console › Variables</b><span>APP_ENV, ANNOUNCEMENT, CLUB_NAME, GOAL_PACE</span></li>
              <li><b>CC_PRE_RUN_HOOK</b><span>scripts/write-config.sh, à chaque démarrage</span></li>
              <li><b>dist/config.json</b><span>servi par Caddy, en no-cache</span></li>
              <li><b>fetch(…, no-store)</b><span>lu au chargement, sans cache navigateur</span></li>
            </ol>
            <figure className="rr-json">
              <figcaption>
                <span>GET /config.json</span>
                <span className={platform.source === "CC_PRE_RUN_HOOK" ? "rr-json__src is-hook" : "rr-json__src"}>
                  {platform.source === "CC_PRE_RUN_HOOK" ? "écrit par le hook" : platform.source === "absent" ? "absent" : "fichier du dépôt"}
                </span>
              </figcaption>
              <pre>{platform.raw ? JSON.stringify(displayConfig(platform.raw), null, 2) : "// config.json absent : valeurs par défaut"}</pre>
            </figure>
            <dl className="rr-config__kv">
              <div><dt>Runtime</dt><dd>Static</dd></div>
              <div><dt>Webroot</dt><dd>CC_WEBROOT=/dist</dd></div>
              <div><dt>Build distant</dt><dd>aucun, dist/ committé</dd></div>
              <div><dt>Serveur</dt><dd>Caddy, via le Caddyfile</dd></div>
            </dl>
            <p className="rr-config__doc">
              <a href={STATIC_DOC_URL} target="_blank" rel="noopener">Runtime Static</a>
              <a href={HOOKS_DOC_URL} target="_blank" rel="noopener">Deployment hooks</a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
