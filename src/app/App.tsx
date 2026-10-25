import { useState, type CSSProperties } from "react";
import { Check, Share2 } from "lucide-react";
import { DistanceSelector, distances } from "./components/DistanceSelector";
import { PaceTrack } from "./components/PaceTrack";
import { RaceBib } from "./components/RaceBib";
import { rankConfigs } from "./components/RankBadge";
import { CleverTopbar } from "./components/clever/CleverTopbar";
import { CleverCert } from "./components/clever/CleverCert";
import { CleverFooter } from "./components/clever/CleverFooter";
import { reveal } from "./components/clever/reveal";
import { usePlatform } from "./config";
import { calculatePercentile, determineRank, formatDuration, splitPoints } from "./utils/calculations";

const STATIC_DOC_URL = "https://www.clever.cloud/developers/doc/deploy/applications/static/";
const HOOKS_DOC_URL = "https://www.clever.cloud/developers/doc/develop/common-configuration/build-hooks/";
const REPO_URL = "https://github.com/Vitiosum/demo-react-vite";

// config.json affiché : sans APP_ID, commit raccourci à 7 caractères.
function displayConfig(raw: Record<string, unknown>) {
  const { APP_ID: _appId, ...rest } = raw;
  void _appId;
  if (typeof rest.CC_COMMIT_ID === "string") rest.CC_COMMIT_ID = rest.CC_COMMIT_ID.slice(0, 7);
  return rest;
}

const digits = (v: string) => v.replace(/\D/g, "").slice(0, 2);
const km = (d: number) => (Number.isInteger(d) ? `${d} km` : `${d.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} km`);

// Lien partageable : ?d=42.195&t=3:29:59 (défaut : 10 km en 48:30).
function initialRace(): { d: string; h: string; m: string; s: string } {
  const q = new URLSearchParams(window.location.search);
  const d = distances.some((x) => x.value === q.get("d")) ? (q.get("d") as string) : "10";
  const t = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})$/.exec(q.get("t") ?? "");
  return t ? { d, h: t[1] ?? "0", m: t[2], s: t[3] } : { d, h: "0", m: "48", s: "30" };
}

export default function App() {
  const platform = usePlatform();
  const [init] = useState(initialRace);
  const [distance, setDistance] = useState(init.d);
  const [hours, setHours] = useState(init.h);
  const [minutes, setMinutes] = useState(init.m);
  const [seconds, setSeconds] = useState(init.s);
  const [copied, setCopied] = useState(false);

  const d = Number(distance);
  const dist = distances.find((x) => x.value === distance) ?? distances[1];
  const h = Number(hours || 0);
  const m = Number(minutes || 0);
  const s = Number(seconds || 0);
  const total = h * 3600 + m * 60 + s;
  const valid = total > 0 && m < 60 && s < 60;
  const pace = valid ? total / d : null;
  const rank = valid ? determineRank(d, total / 60) : null;
  const percentile = valid ? calculatePercentile(d, total / 60) : null;
  const color = rank ? rankConfigs[rank].color : "var(--cc-muted)";

  const { goalPace, club } = platform;
  const delta = pace === null ? 0 : Math.round(pace - goalPace);

  const share = () => {
    if (!valid || pace === null || !rank) return;
    const url = `${window.location.origin}${window.location.pathname}?d=${distance}&t=${formatDuration(total)}`;
    const text = `${dist.short} en ${formatDuration(total)} · ${formatDuration(pace)}/km · rang ${rank} (top ${percentile} %) #RunRank ${url}`;
    if (navigator.share) {
      navigator.share({ title: "Mon allure RunRank", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fields = [
    { id: "hours", label: "h", name: "Heures", value: hours, set: setHours },
    { id: "minutes", label: "min", name: "Minutes", value: minutes, set: setMinutes },
    { id: "seconds", label: "s", name: "Secondes", value: seconds, set: setSeconds },
  ];

  return (
    <>
      <CleverTopbar demo="RunRank" stack="React 18 · Vite 8 · Static" live={platform.live} />

      {platform.announcement && (
        <div className="rr-announce" role="status">
          <div className="cc-container">
            <code>ANNOUNCEMENT</code>
            <span>{platform.announcement}</span>
          </div>
        </div>
      )}

      <main id="top">
        <div className="cc-container">
          <section className="rr-board" aria-labelledby="pace-title">
            <div className="rr-board__main">

              <h1 id="pace-title" className="rr-pace cc-reveal" style={reveal(0)}>
                <span className="rr-pace__lead">
                  Votre {dist.short} en{" "}
                  {valid ? formatDuration(total) : "…"}, c'est
                </span>{" "}
                <span className={pace === null ? "rr-pace__num is-empty" : "rr-pace__num"} aria-live="polite" aria-atomic="true">
                  {pace === null ? "0:00" : formatDuration(pace)}
                  <small>/km</small>
                </span>
              </h1>

              {valid && rank && pace !== null ? (
                <div className="rr-verdict cc-reveal" style={reveal(1)}>
                  <span className="rr-rank" style={{ "--c": color } as CSSProperties}>{rank}</span>
                  <span>top {percentile} % des coureurs</span>
                  <span className={delta <= 0 ? "rr-goal is-met" : "rr-goal"}>
                    {delta <= 0
                      ? `Objectif ${club} tenu : ${Math.abs(delta)} s/km d'avance`
                      : `Objectif ${club} : encore ${delta} s/km à gagner`}
                  </span>
                </div>
              ) : (
                <p className="rr-verdict rr-verdict--empty cc-reveal" style={reveal(1)}>
                  Saisissez un temps valide (minutes et secondes sous 60).
                </p>
              )}

              <form className="rr-input cc-reveal" style={reveal(2)} onSubmit={(e) => e.preventDefault()} aria-label="Votre course">
                <DistanceSelector value={distance} onChange={setDistance} />
                <div className="rr-time" role="group" aria-label="Votre temps">
                  {fields.map((f, i) => (
                    <label key={f.id} className="rr-time__cell" htmlFor={f.id}>
                      <input
                        id={f.id}
                        className="rr-time__input"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={2}
                        aria-label={f.name}
                        aria-invalid={f.id !== "hours" && Number(f.value || 0) > 59}
                        value={f.value}
                        onChange={(e) => f.set(digits(e.target.value))}
                        onFocus={(e) => e.target.select()}
                      />
                      <span>{f.label}</span>
                      {i < 2 && <i aria-hidden="true">:</i>}
                    </label>
                  ))}
                </div>
              </form>

              <div className="cc-reveal" style={reveal(3)}>
                <PaceTrack pace={pace} rank={rank} goalPace={goalPace} club={club} />
              </div>

              <div className="rr-board__cta cc-reveal" style={reveal(4)}>
                <button type="button" className="cc-btn cc-btn--gradient" onClick={share} disabled={!valid}>
                  {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
                  {copied ? "Copié" : "Partager mon allure"}
                </button>
                <a className="cc-btn" href="#cert-title">Se certifier Clever Cloud ↓</a>
              </div>

              <div className="rr-band cc-reveal" style={reveal(5)} aria-label="Bracelet d'allure : temps de passage">
                <span className="rr-band__title">Bracelet d'allure</span>
                <ol>
                  {splitPoints(d).map((p) => (
                    <li key={p}>
                      <span>{km(p)}</span>
                      <b>{pace === null ? "–" : formatDuration(pace * p)}</b>
                    </li>
                  ))}
                </ol>
                <span className="rr-band__goal">
                  À l'objectif {formatDuration(goalPace)}/km : <b>{formatDuration(goalPace * d)}</b>
                </span>
              </div>

            </div>

            <RaceBib platform={platform} />
          </section>
        </div>

        <CleverCert />

        <section id="config" className="cc-container rr-config" aria-labelledby="config-title">
          <div className="rr-config__text">
            <h2 id="config-title">Une app statique qui lit ses variables d'environnement</h2>
            <p>
              Le navigateur ne voit pas les variables de l'app. Avant chaque démarrage, Clever Cloud lance le hook{" "}
              <span className="cc-kbd">CC_PRE_RUN_HOOK</span> : un script shell écrit <span className="cc-kbd">dist/config.json</span>,
              que React lit sans cache. Changez <span className="cc-kbd">GOAL_PACE</span> dans la console, faites un{" "}
              <span className="cc-kbd">clever restart</span>, rechargez : le drapeau bouge.
            </p>
            <ol className="rr-flow">
              <li><b>Console › Variables</b><span>APP_ENV, ANNOUNCEMENT, CLUB_NAME, GOAL_PACE</span></li>
              <li><b>CC_PRE_RUN_HOOK</b><span>scripts/write-config.sh, à chaque démarrage</span></li>
              <li><b>dist/config.json</b><span>servi par Static Web Server</span></li>
              <li><b>fetch(…, no-store)</b><span>lu au chargement, sans cache navigateur</span></li>
            </ol>
            <dl className="rr-config__kv">
              <div><dt>Runtime</dt><dd>Static</dd></div>
              <div><dt>Webroot</dt><dd>CC_WEBROOT=/dist</dd></div>
              <div><dt>Build distant</dt><dd>aucun, dist/ committé</dd></div>
              <div><dt>Serveur</dt><dd>Static Web Server</dd></div>
            </dl>
            <p className="rr-config__doc">
              <a href={STATIC_DOC_URL} target="_blank" rel="noopener">Runtime Static</a> ·{" "}
              <a href={HOOKS_DOC_URL} target="_blank" rel="noopener">Deployment hooks</a>
            </p>
          </div>
          <figure className="rr-json">
            <figcaption>
              <span>GET /config.json</span>
              <span className={platform.source === "CC_PRE_RUN_HOOK" ? "rr-json__src is-hook" : "rr-json__src"}>
                {platform.source === "CC_PRE_RUN_HOOK" ? "écrit par le hook" : platform.source === "absent" ? "absent" : "fichier du dépôt"}
              </span>
            </figcaption>
            <pre>{platform.raw ? JSON.stringify(displayConfig(platform.raw), null, 2) : "// config.json absent : valeurs par défaut"}</pre>
          </figure>
        </section>
      </main>

      <CleverFooter
        repoUrl={REPO_URL}
        runtimeDocUrl={STATIC_DOC_URL}
        runtimeDocLabel="Runtime Static"
        extraDocs={[
          { label: "Deployment hooks", href: HOOKS_DOC_URL },
          { label: "Variables d'environnement", href: "https://www.clever.cloud/developers/doc/develop/common-configuration/environment-variables/reference/" },
        ]}
      />
    </>
  );
}
