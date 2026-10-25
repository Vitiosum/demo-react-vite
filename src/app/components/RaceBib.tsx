import type { CSSProperties } from "react";
import type { Platform } from "../config";
import { formatDuration } from "../utils/calculations";

const INJECTED = "injecté au déploiement";

function Value({ value }: { value: string }) {
  return value ? <dd>{value}</dd> : <dd className="is-empty">{INJECTED}</dd>;
}

// Dossard de course : le numéro est celui de l'instance qui a servi la page,
// les lignes sont les variables lues dans config.json.
export function RaceBib({ platform: p }: { platform: Platform }) {
  const bib = p.instanceNumber ? p.instanceNumber.padStart(3, "0") : "000";
  const time = p.generatedAt ? new Date(p.generatedAt) : null;
  const written =
    time && !Number.isNaN(time.getTime())
      ? time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "";

  return (
    <aside className="rr-bib cc-reveal" style={{ "--i": 2 } as CSSProperties} aria-label="Dossard : variables lues par l'application">
      <i className="rr-bib__pin" aria-hidden="true" />
      <i className="rr-bib__pin" aria-hidden="true" />
      <i className="rr-bib__pin" aria-hidden="true" />
      <i className="rr-bib__pin" aria-hidden="true" />
      <div className="rr-bib__band">
        <span className="rr-bib__club">{p.club}</span>
        <span className={p.env === "production" ? "rr-env is-production" : "rr-env"}>{p.env}</span>
      </div>
      <div className="rr-bib__body">
        <div className={p.instanceNumber ? "rr-bib__num" : "rr-bib__num is-empty"} aria-label={`Dossard ${bib}`}>
          {bib}
        </div>
        <div className="rr-bib__runner">
          {p.instanceName ? p.instanceName : "Instance locale"}
          {p.appName && <span> · {p.appName}</span>}
        </div>

        <ul className="rr-bib__vars" aria-label="Variables de démo">
          <li><span>APP_ENV</span><b>{p.env}</b></li>
          <li><span>CLUB_NAME</span><b>{p.club}</b></li>
          <li>
            <span>GOAL_PACE</span>
            <b>{formatDuration(p.goalPace)}/km{!p.goalPaceValid && <small> (valeur invalide ignorée)</small>}</b>
          </li>
          <li><span>ANNOUNCEMENT</span>{p.announcement ? <b>définie</b> : <b className="is-empty">non définie</b>}</li>
        </ul>

        <dl className="rr-bib__platform">
          <div><dt>Instance</dt><Value value={p.instanceNumber ? `#${p.instanceNumber}` : ""} /></div>
          <div><dt>Type d'instance</dt><Value value={p.instanceType} /></div>
          <div><dt>Commit déployé</dt><Value value={p.commit} /></div>
          <div><dt>Déploiement</dt><Value value={p.deployment} /></div>
        </dl>
      </div>
      <div className="rr-bib__foot">
        {p.source === "CC_PRE_RUN_HOOK" ? (
          <>config.json écrit par <code>CC_PRE_RUN_HOOK</code>{written && <> à {written}</>}</>
        ) : p.source === "absent" ? (
          <>config.json absent · valeurs par défaut</>
        ) : (
          <>config.json du dépôt · valeurs par défaut</>
        )}
      </div>
    </aside>
  );
}
