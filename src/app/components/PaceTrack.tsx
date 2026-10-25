import type { CSSProperties } from "react";
import { rankConfigs, type RankType } from "./RankBadge";
import { PACE_SCALE, RANK_LADDER, formatDuration, paceToPosition } from "../utils/calculations";

interface PaceTrackProps {
  /** Allure du coureur en s/km, ou null si le temps saisi est invalide. */
  pace: number | null;
  rank: RankType | null;
  /** Allure objectif du club (GOAL_PACE), en s/km. */
  goalPace: number;
  club: string;
}

const span = PACE_SCALE.slowest - PACE_SCALE.fastest;

// La piste : 9 couloirs de rang, du plus lent (Iron) au plus rapide (Challenger),
// le coureur et le drapeau d'objectif du club posés à leur allure.
export function PaceTrack({ pace, rank, goalPace, club }: PaceTrackProps) {
  const runner = pace === null ? null : paceToPosition(pace);
  const goal = paceToPosition(goalPace);
  // Côté des étiquettes : à l'opposé l'une de l'autre, et jamais hors de la piste.
  const goalLabelLeft = goal > 0.75 || (goal >= 0.25 && (runner === null ? goal > 0.6 : runner > goal));
  const runnerLabelRight = runner !== null && runner < 0.85 && (runner < 0.15 || runner > goal);

  return (
    <figure className="rr-track" aria-label={`Échelle des rangs par allure. Objectif ${club} : ${formatDuration(goalPace)} par km.`}>
      <div className="rr-track__lanes">
        {RANK_LADDER.map(({ rank: r, from, to }, n) => (
          <span
            key={r}
            className={r === rank ? "rr-track__lane is-current" : "rr-track__lane"}
            style={{ "--c": rankConfigs[r].color, "--n": n, flexGrow: (from - to) / span } as CSSProperties}
            title={`${r} : allure jusqu'à ${formatDuration(to)}/km`}
          >
            <b>{r}</b>
          </span>
        ))}
        <span className={goalLabelLeft ? "rr-track__goal is-behind" : "rr-track__goal"} style={{ left: `${goal * 100}%` }}>
          <em>Objectif {formatDuration(goalPace)}</em>
        </span>
        {runner !== null && rank && (
          <span
            className={runnerLabelRight ? "rr-track__runner is-ahead" : "rr-track__runner"}
            style={{ left: `${runner * 100}%`, "--c": rankConfigs[rank].color } as CSSProperties}
          >
            <em>Toi</em>
          </span>
        )}
      </div>
      <figcaption className="rr-track__scale">
        <span>{formatDuration(PACE_SCALE.slowest)}/km</span>
        <span>plus rapide →</span>
        <span>{formatDuration(PACE_SCALE.fastest)}/km</span>
      </figcaption>
    </figure>
  );
}
