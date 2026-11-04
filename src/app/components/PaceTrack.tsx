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

// L'échelle des rangs, en bas du tableau d'affichage : 9 segments LED, du plus lent (Iron)
// au plus rapide (Challenger). Le segment du rang atteint s'allume ; « Vous » et le drapeau
// d'objectif du club (GOAL_PACE) sont posés à leur allure.
export function PaceTrack({ pace, rank, goalPace, club }: PaceTrackProps) {
  const runner = pace === null ? null : paceToPosition(pace);
  const goal = paceToPosition(goalPace);
  // Côté des étiquettes : à l'opposé l'une de l'autre, et jamais hors de l'échelle.
  const goalLabelLeft = goal > 0.75 || (goal >= 0.25 && (runner === null ? goal > 0.6 : runner > goal));
  const runnerLabelRight = runner !== null && runner < 0.85 && (runner < 0.15 || runner > goal);

  return (
    <figure className="rr-ladder" aria-label={`Échelle des rangs par allure. Objectif ${club} : ${formatDuration(goalPace)} par km.`}>
      <div className="rr-ladder__bar">
        {RANK_LADDER.map(({ rank: r, from, to }) => (
          <span
            key={r}
            className={r === rank ? "rr-ladder__seg is-current" : "rr-ladder__seg"}
            style={{ "--c": rankConfigs[r].color, flexGrow: (from - to) / span } as CSSProperties}
            title={`${r} : allure jusqu'à ${formatDuration(to)}/km`}
          />
        ))}
        <span className={goalLabelLeft ? "rr-ladder__goal is-behind" : "rr-ladder__goal"} style={{ left: `${goal * 100}%` }}>
          <em>Objectif {formatDuration(goalPace)}</em>
        </span>
        {runner !== null && rank && (
          <span
            className={runnerLabelRight ? "rr-ladder__you is-ahead" : "rr-ladder__you"}
            style={{ left: `${runner * 100}%`, "--c": rankConfigs[rank].color } as CSSProperties}
          >
            <em>Vous</em>
          </span>
        )}
      </div>
      <figcaption className="rr-ladder__scale">
        <span>Iron, {formatDuration(PACE_SCALE.slowest)}/km</span>
        <span aria-hidden="true">plus rapide</span>
        <span>Challenger, {formatDuration(PACE_SCALE.fastest)}/km</span>
      </figcaption>
    </figure>
  );
}
