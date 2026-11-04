import { Check, Share2 } from "lucide-react";
import type { Platform } from "../config";
import { formatDuration } from "../utils/calculations";

interface RaceBibProps {
  platform: Platform;
  /** « 10 km en 48:30, 4:51/km », ou null si le temps est invalide. */
  race: string | null;
  /** Lien de partage relatif : « /?d=10&t=48:30 ». */
  sharePath: string | null;
  copied: boolean;
  onShare: () => void;
}

// Le dossard : son numéro est celui de l'instance qui a servi la page (INSTANCE_NUMBER + 1),
// sa bande porte CLUB_NAME et APP_ENV, et sa puce de chronométrage est le lien de partage.
export function RaceBib({ platform: p, race, sharePath, copied, onShare }: RaceBibProps) {
  const n = Number(p.instanceNumber);
  const hasInstance = p.instanceNumber !== "" && Number.isInteger(n) && n >= 0;
  const bib = hasInstance ? String(n + 1).padStart(3, "0") : "000";
  const time = p.generatedAt ? new Date(p.generatedAt) : null;
  const written =
    time && !Number.isNaN(time.getTime())
      ? time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "";

  return (
    <article className="rr-bib" aria-label={`Dossard ${bib}`}>
      <i className="rr-bib__pin" aria-hidden="true" />
      <i className="rr-bib__pin" aria-hidden="true" />
      <i className="rr-bib__pin" aria-hidden="true" />
      <i className="rr-bib__pin" aria-hidden="true" />
      <div className="rr-bib__band">
        <span className="rr-bib__club">{p.club}</span>
        <span className={p.env === "production" ? "rr-env is-production" : "rr-env"} title="APP_ENV">{p.env}</span>
      </div>
      <div className="rr-bib__body">
        <div className={hasInstance ? "rr-bib__num" : "rr-bib__num is-empty"}>{bib}</div>
        <p className="rr-bib__runner">
          {p.instanceName || "Instance locale"}
          {hasInstance && <small>instance #{p.instanceNumber}</small>}
        </p>
        <p className="rr-bib__race">{race ?? "Temps à saisir sur le tableau"}</p>
        <p className="rr-bib__goal">
          Objectif du club <b>{formatDuration(p.goalPace)}/km</b>
          {!p.goalPaceValid && <small> (valeur invalide ignorée)</small>}
        </p>
        <div className="rr-chip">
          <span className="rr-chip__foil" aria-hidden="true" />
          <code className="rr-chip__link">{sharePath ?? "/?d=…&t=…"}</code>
          <button type="button" className="rr-chip__btn" onClick={onShare} disabled={!sharePath}>
            {copied ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
            {copied ? "Lien copié" : "Partager mon dossard"}
          </button>
        </div>
      </div>
      <div className="rr-bib__foot">
        {p.source === "CC_PRE_RUN_HOOK" ? (
          <>config.json écrit par <code>CC_PRE_RUN_HOOK</code>{written && <> à {written}</>}</>
        ) : p.source === "absent" ? (
          <>config.json absent, valeurs par défaut</>
        ) : (
          <>config.json du dépôt, valeurs par défaut</>
        )}
      </div>
    </article>
  );
}
