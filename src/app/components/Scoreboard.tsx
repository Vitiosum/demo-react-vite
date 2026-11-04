import type { CSSProperties } from "react";
import { DistanceSelector } from "./DistanceSelector";
import { PaceTrack } from "./PaceTrack";
import { rankConfigs, type RankType } from "./RankBadge";
import { formatDuration } from "../utils/calculations";

export interface TimeField {
  id: string;
  label: string;
  name: string;
  value: string;
  set: (v: string) => void;
}

interface ScoreboardProps {
  distance: string;
  onDistance: (v: string) => void;
  fields: TimeField[];
  /** « 10 km », « semi », « marathon »… */
  distLabel: string;
  total: number;
  valid: boolean;
  pace: number | null;
  rank: RankType | null;
  percentile: number | null;
  goalPace: number;
  club: string;
}

const digits = (v: string) => v.replace(/\D/g, "").slice(0, 2);

/** « 4:51 » avec un deux-points de tableau d'affichage : deux LED rondes (le texte reste « : »). */
const led = (time: string) =>
  time.split(":").flatMap((part, i) => (i ? [<span key={i} className="rr-colon">:</span>, part] : [part]));

// Le tableau d'affichage du stade : on y choisit l'épreuve et on y tape son temps,
// il affiche l'allure, le rang et l'écart à l'objectif du club (GOAL_PACE).
export function Scoreboard(p: ScoreboardProps) {
  const color = p.rank ? rankConfigs[p.rank].color : "#ffb13d";
  const delta = p.pace === null ? 0 : Math.round(p.pace - p.goalPace);

  return (
    <div className="rr-board">
      <form className="rr-board__input" onSubmit={(e) => e.preventDefault()} aria-label="Votre course">
        <DistanceSelector value={p.distance} onChange={p.onDistance} />
        <div className="rr-time" role="group" aria-label="Votre temps">
          {p.fields.map((f, i) => (
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
              {i < 2 && <i className="rr-colon" aria-hidden="true">:</i>}
            </label>
          ))}
        </div>
      </form>

      <div className="rr-board__main">
        <h1 id="pace-title" className="rr-pace">
          <span className="rr-pace__lead">
            Votre {p.distLabel} en {p.valid ? formatDuration(p.total) : "…"}, c'est
          </span>{" "}
          <span className={p.pace === null ? "rr-pace__num is-empty" : "rr-pace__num"} aria-live="polite" aria-atomic="true">
            {led(p.pace === null ? "0:00" : formatDuration(p.pace))}
            <small>/km</small>
          </span>
        </h1>
        {p.valid && p.rank ? (
          <p className="rr-rank" style={{ "--c": color } as CSSProperties}>
            <b>{p.rank}</b>
            <span>top {p.percentile} % des coureurs</span>
          </p>
        ) : (
          <p className="rr-rank is-empty">
            <span>Saisissez un temps valide (minutes et secondes sous 60).</span>
          </p>
        )}
      </div>

      {p.pace !== null && (
        <p className={delta <= 0 ? "rr-goal is-met" : "rr-goal"}>
          {delta <= 0
            ? `Objectif ${p.club} tenu : ${Math.abs(delta)} s/km d'avance`
            : `Objectif ${p.club} : encore ${delta} s/km à gagner`}
        </p>
      )}

      <PaceTrack pace={p.pace} rank={p.rank} goalPace={p.goalPace} club={p.club} />
    </div>
  );
}
