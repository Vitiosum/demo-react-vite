// Les « lièvres » qui tournent sur la piste à côté de vous.
// Allures de référence fixes (de simples divisions, rien à mettre à jour) ;
// l'objectif du club vient de GOAL_PACE (config.json) et allume les feux de cadence.

/** La piste est accélérée : un tour de 400 m à 4:51/km prend 116 s en vrai, 5,8 s à l'écran. */
export const ACCEL = 20;
export const LAP_M = 400;

export interface Hare {
  id: string;
  name: string;
  detail: string;
  /** Allure en s/km. */
  pace: number;
  /** Couloir (1 à 8) ; 0 = feux de cadence le long de la corde. */
  lane: number;
  color: string;
}

export const YOU_LANE = 2;
export const PACER_COLOR = "#46f08c";

export const HARES: Hare[] = [
  { id: "elite", name: "Lièvre élite", detail: "le marathon en 2 h", pace: 7200 / 42.195, lane: 4, color: "#fcb900" },
  { id: "sunday", name: "Marathonien du dimanche", detail: "4 h 30 au marathon", pace: 16200 / 42.195, lane: 6, color: "#b7b5ff" },
];

/** Durée réelle d'un tour de piste (s) à une allure donnée (s/km). */
export const lapSeconds = (pace: number) => (pace * LAP_M) / 1000;
