import type { CSSProperties } from "react";
import { ACCEL, HARES, PACER_COLOR, YOU_LANE, lapSeconds } from "../utils/hares";
import { formatDuration, splitPoints } from "../utils/calculations";

interface RaceResultsProps {
  /** Distance en km. */
  d: number;
  distLabel: string;
  /** Votre temps (s) et votre allure (s/km), null si le temps est invalide. */
  total: number;
  pace: number | null;
  youColor: string;
  goalPace: number;
  club: string;
}

const km = (d: number) => (Number.isInteger(d) ? `${d} km` : `${d.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} km`);
const seconds = (s: number) => s.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

// Sous la piste : l'ordre d'arrivée sur votre distance si chacun tenait son allure,
// puis le bracelet d'allure (temps de passage).
export function RaceResults({ d, distLabel, total, pace, youColor, goalPace, club }: RaceResultsProps) {
  const rows = [
    ...(pace === null ? [] : [{ id: "you", name: "Vous", detail: `couloir ${YOU_LANE}`, pace, color: youColor, you: true }]),
    { id: "pacer", name: "Feux de cadence", detail: `objectif ${club}, le long de la corde`, pace: goalPace, color: PACER_COLOR, you: false },
    ...HARES.map((h) => ({ id: h.id, name: h.name, detail: `${h.detail}, couloir ${h.lane}`, pace: h.pace, color: h.color, you: false })),
  ]
    .map((r) => ({ ...r, time: r.pace * d }))
    .sort((a, b) => a.time - b.time);

  const gap = (t: number) => {
    const g = Math.round(t - total);
    if (pace === null) return "";
    if (g === 0) return "ex aequo";
    return g < 0 ? `${formatDuration(-g)} avant vous` : `${formatDuration(g)} après vous`;
  };
  const lap = lapSeconds(pace ?? goalPace);

  return (
    <div className="rr-results">
      <div className="rr-results__head">
        <h2>Classement à l'arrivée</h2>
        <p>
          Sur votre {distLabel}, si chacun tient son allure. La piste tourne {ACCEL} fois plus vite que la réalité : un tour de
          400 m {pace === null ? "à l'objectif" : "à votre allure"} y prend {seconds(lap / ACCEL)} s au lieu de {formatDuration(lap)}.
        </p>
      </div>
      <ol className="rr-results__list">
        {rows.map((r, i) => (
          <li key={r.id} className={r.you ? "is-you" : undefined} style={{ "--c": r.color } as CSSProperties}>
            <span className="rr-results__pos">{i + 1}</span>
            <span className="rr-results__who">
              <b>{r.name}</b>
              <small>{r.detail}</small>
            </span>
            <span className="rr-results__pace">{formatDuration(r.pace)}/km</span>
            <span className="rr-results__time">{formatDuration(r.time)}</span>
            <span className="rr-results__gap">{r.you ? "" : gap(r.time)}</span>
          </li>
        ))}
      </ol>

      <div className="rr-band" aria-label="Bracelet d'allure : temps de passage">
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
  );
}
