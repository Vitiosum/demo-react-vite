import { useState } from "react";
import { distances } from "./components/DistanceSelector";
import { Scoreboard, type TimeField } from "./components/Scoreboard";
import { Stadium, type Mover } from "./components/Stadium";
import { RaceResults } from "./components/RaceResults";
import { RaceBib } from "./components/RaceBib";
import { PlatformPanel } from "./components/PlatformPanel";
import { StaticRuntime } from "./components/StaticRuntime";
import { rankConfigs } from "./components/RankBadge";
import { CleverTopbar } from "./components/clever/CleverTopbar";
import { CleverCert } from "./components/clever/CleverCert";
import { CleverFooter } from "./components/clever/CleverFooter";
import { usePlatform } from "./config";
import { calculatePercentile, determineRank, formatDuration } from "./utils/calculations";
import { HARES, YOU_LANE } from "./utils/hares";

const STATIC_DOC_URL = "https://www.clever.cloud/developers/doc/deploy/applications/static/";
const HOOKS_DOC_URL = "https://www.clever.cloud/developers/doc/develop/common-configuration/build-hooks/";
const REPO_URL = "https://github.com/Vitiosum/demo-react-vite";

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
  const total = Number(hours || 0) * 3600 + Number(minutes || 0) * 60 + Number(seconds || 0);
  const valid = total > 0 && Number(minutes || 0) < 60 && Number(seconds || 0) < 60;
  const pace = valid ? total / d : null;
  const rank = valid ? determineRank(d, total / 60) : null;
  const percentile = valid ? calculatePercentile(d, total / 60) : null;
  const youColor = rank ? rankConfigs[rank].color : "#ffffff";
  const { goalPace, club } = platform;

  const sharePath = valid ? `${window.location.pathname}?d=${distance}&t=${formatDuration(total)}` : null;
  const share = () => {
    if (!sharePath || pace === null || !rank) return;
    const url = `${window.location.origin}${sharePath}`;
    const text = `${dist.short} en ${formatDuration(total)}, ${formatDuration(pace)}/km, rang ${rank} (top ${percentile} %) #RunRank ${url}`;
    if (navigator.share) {
      navigator.share({ title: "Mon dossard RunRank", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fields: TimeField[] = [
    { id: "hours", label: "h", name: "Heures", value: hours, set: setHours },
    { id: "minutes", label: "min", name: "Minutes", value: minutes, set: setMinutes },
    { id: "seconds", label: "s", name: "Secondes", value: seconds, set: setSeconds },
  ];

  const movers: Mover[] = [
    ...HARES.map((h) => ({ id: h.id, pace: h.pace, lane: h.lane, color: h.color })),
    { id: "you", pace, lane: YOU_LANE, color: youColor, you: true },
  ];

  return (
    <>
      <CleverTopbar demo="RunRank" stack="React 18 · Vite 8 · Static" live={platform.live} />

      {platform.announcement && (
        <div className="rr-ribbon" role="status">
          <div className="cc-container rr-ribbon__inner">
            <code>ANNOUNCEMENT</code>
            <div className="rr-ribbon__window">
              <p className="rr-ribbon__track">
                <span>{platform.announcement}</span>
                {[1, 2, 3, 4, 5].map((k) => (
                  <span key={k} aria-hidden="true">{platform.announcement}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}

      <main id="top">
        <section className="cc-container rr-stadium" aria-labelledby="pace-title">
          <div className="rr-arena">
            <Scoreboard
              distance={distance}
              onDistance={setDistance}
              fields={fields}
              distLabel={dist.short}
              total={total}
              valid={valid}
              pace={pace}
              rank={rank}
              percentile={percentile}
              goalPace={goalPace}
              club={club}
            />
            <Stadium
              movers={movers}
              goalPace={goalPace}
              refPace={pace ?? goalPace}
              label={`Piste de 400 m vue de haut. Vous tournez à ${pace === null ? "–" : formatDuration(pace)}/km, les feux de cadence à l'objectif de ${club}, ${formatDuration(goalPace)}/km.`}
            />
          </div>

          <div className="rr-paddock">
            <div className="rr-paddock__main">
              <RaceResults d={d} distLabel={dist.short} total={total} pace={pace} youColor={youColor} goalPace={goalPace} club={club} />
              <PlatformPanel platform={platform} />
              <a className="cc-btn rr-paddock__cert" href="#cert-title">Se certifier Clever Cloud ↓</a>
            </div>
            <div className="rr-paddock__side">
              <RaceBib
                platform={platform}
                race={pace === null ? null : `${dist.short} en ${formatDuration(total)}, ${formatDuration(pace)}/km`}
                sharePath={sharePath}
                copied={copied}
                onShare={share}
              />
            </div>
          </div>
        </section>

        <CleverCert />

        <StaticRuntime platform={platform} />
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
