// Variables de démo d'une app statique.
//
// Le navigateur n'a pas accès aux variables d'environnement. Sur Clever Cloud,
// scripts/write-config.sh tourne en CC_PRE_RUN_HOOK avant chaque démarrage et écrit
// dist/config.json ; l'app le lit avec fetch(cache: "no-store") pour contourner le cache
// HTTP du serveur statique. En local, le fichier du dépôt (valeurs vides) donne les défauts,
// et un fichier absent ou invalide ne bloque pas l'affichage.

import { useEffect, useState } from "react";

export interface RawConfig {
  [key: string]: unknown;
}

export interface Platform {
  /** true si l'app tourne sur Clever Cloud (APP_ID injecté). */
  live: boolean;
  /** Origine du fichier : « CC_PRE_RUN_HOOK », « dépôt » ou « absent ». */
  source: string;
  generatedAt: string;
  env: string;
  announcement: string;
  club: string;
  /** Allure objectif du club, en secondes par km. */
  goalPace: number;
  /** false si GOAL_PACE est renseignée mais illisible (le défaut s'applique). */
  goalPaceValid: boolean;
  appName: string;
  instanceNumber: string;
  instanceName: string;
  instanceType: string;
  commit: string;
  deployment: string;
  raw: RawConfig | null;
}

export const DEFAULT_CLUB = "RunRank Club";
export const DEFAULT_GOAL_PACE = 300; // 5:00 /km

/** « 4:30 » → 270. Accepte m:ss entre 2:00 et 12:00, sinon null. */
export function parsePace(value: string): number | null {
  const m = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
  if (!m) return null;
  const s = Number(m[1]) * 60 + Number(m[2]);
  return s >= 120 && s <= 720 ? s : null;
}

const str = (raw: RawConfig | null, key: string): string => {
  const v = raw?.[key];
  return typeof v === "string" ? v.trim() : "";
};

export function toPlatform(raw: RawConfig | null): Platform {
  const goalRaw = str(raw, "GOAL_PACE");
  return {
    live: str(raw, "APP_ID") !== "",
    source: raw ? str(raw, "source") || "dépôt" : "absent",
    generatedAt: str(raw, "generated_at"),
    env: str(raw, "APP_ENV") || "local",
    announcement: str(raw, "ANNOUNCEMENT"),
    club: str(raw, "CLUB_NAME") || DEFAULT_CLUB,
    goalPace: parsePace(goalRaw) ?? DEFAULT_GOAL_PACE,
    goalPaceValid: goalRaw === "" || parsePace(goalRaw) !== null,
    appName: str(raw, "CC_APP_NAME"),
    instanceNumber: str(raw, "INSTANCE_NUMBER"),
    instanceName: str(raw, "CC_PRETTY_INSTANCE_NAME"),
    instanceType: str(raw, "INSTANCE_TYPE"),
    commit: str(raw, "CC_COMMIT_ID").slice(0, 7),
    deployment: str(raw, "CC_DEPLOYMENT_ID").slice(0, 8),
    raw,
  };
}

/** Lit /config.json une fois ; rend les défauts tout de suite, puis la config lue. */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>(() => toPlatform(null));
  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}config.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (alive) setPlatform(toPlatform(json && typeof json === "object" ? (json as RawConfig) : null));
      })
      .catch(() => {
        /* fichier absent ou invalide : on garde les défauts */
      });
    return () => {
      alive = false;
    };
  }, []);
  return platform;
}
