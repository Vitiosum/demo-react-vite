import { useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { DistanceSelector } from "./components/DistanceSelector";
import { ResultCard } from "./components/ResultCard";
import { CleverTopbar } from "./components/clever/CleverTopbar";
import { CleverCert } from "./components/clever/CleverCert";
import { CleverFooter } from "./components/clever/CleverFooter";
import { isLiveOnCleverCloud } from "./components/clever/platform";
import { reveal } from "./components/clever/reveal";
import { calculateRunResult } from "./utils/calculations";

const STATIC_DOC_URL = "https://www.clever.cloud/developers/doc/applications/static/";
const REPO_URL = "https://github.com/Vitiosum/demo-react-vite";

export default function App() {
  const [distance, setDistance]           = useState("10");
  const [hours, setHours]                 = useState("");
  const [minutes, setMinutes]             = useState("");
  const [seconds, setSeconds]             = useState("");
  const [result, setResult]               = useState<ReturnType<typeof calculateRunResult>>(null);
  const [error, setError]                 = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const live = isLiveOnCleverCloud();

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const h = parseInt(hours   || "0", 10);
    const m = parseInt(minutes || "0", 10);
    const s = parseInt(seconds || "0", 10);

    if (h === 0 && m === 0 && s === 0) {
      setError("Veuillez entrer un temps valide");
      return;
    }

    setIsCalculating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const distanceKm = parseInt(distance, 10);
    const timeString =
      h > 0
        ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        : `${m}:${String(s).padStart(2, "0")}`;

    const calculatedResult = calculateRunResult(distanceKm, timeString);
    setIsCalculating(false);

    if (!calculatedResult) {
      setError("Temps invalide");
      return;
    }
    setResult(calculatedResult);
  };

  const handleReset = () => {
    setResult(null);
    setHours("");
    setMinutes("");
    setSeconds("");
    setError("");
  };

  const handleHoursChange = (val: string) => {
    setHours(val);
    if (val.length >= 2) minutesRef.current?.focus();
  };

  const handleMinutesChange = (val: string) => {
    setMinutes(val);
    if (val.length >= 2 && parseInt(val) >= 10) secondsRef.current?.focus();
  };

  const timeFields = [
    { id: "hours",   val: hours,   onChange: handleHoursChange,   ref: undefined,  max: 24, label: "Heures"   },
    { id: "minutes", val: minutes, onChange: handleMinutesChange, ref: minutesRef, max: 59, label: "Minutes"  },
    { id: "seconds", val: seconds, onChange: setSeconds,          ref: secondsRef, max: 59, label: "Secondes" },
  ];

  const displayedTime = hours
    ? `${hours}:${String(minutes || "0").padStart(2, "0")}:${String(seconds || "0").padStart(2, "0")}`
    : `${minutes}:${String(seconds || "0").padStart(2, "0")}`;

  return (
    <>
      <CleverTopbar demo="RunRank" stack="React 18 · Vite 8 · Static" />

      <main>
        {/* Héro */}
        <section className="cc-hero">
          <div className="cc-container">
            <div className="cc-eyebrow cc-reveal" style={reveal(0)}>Runtime Static · Build Vite committé</div>
            <h1 className="cc-hero__title cc-reveal" style={reveal(1)}>
              RunRank, <span className="cc-grad-text">servi en statique.</span>
            </h1>
            <p className="cc-hero__lead cc-reveal" style={reveal(2)}>
              Un calculateur d'allure React 18 buildé par Vite. <strong>Le build est committé dans{" "}
              <span className="cc-kbd">dist/</span> et servi tel quel</strong> par le runtime Static de Clever Cloud :
              aucun serveur, aucun build distant, rien à exécuter côté plateforme.
            </p>
            <ul className="cc-facts cc-reveal" style={reveal(3)}>
              <li>Build Vite committé</li>
              <li>Runtime Static, zéro serveur</li>
              <li>HTTPS et domaine inclus</li>
              <li>Déployé en un git push</li>
            </ul>
          </div>
        </section>

        {/* Calculateur */}
        <section className="cc-section" style={{ paddingTop: 0 }}>
          <div className="cc-container">
            <div className="rr-calc cc-reveal" style={reveal(4)}>
              {!result ? (
                <form className="cc-card cc-card--pad rr-form cc-reveal" style={reveal(0)} onSubmit={handleCalculate} noValidate>
                  <div className="cc-section__head">
                    <h2 className="cc-section__title">Calcule ton rang</h2>
                    <span className="cc-section__sub">9 rangs · Iron → Challenger</span>
                  </div>

                  <div className="cc-field">
                    <span className="cc-label">Distance</span>
                    <DistanceSelector value={distance} onChange={setDistance} />
                  </div>

                  <div className="cc-field">
                    <label className="cc-label" htmlFor="hours">Ton temps</label>
                    <div className="rr-time">
                      {timeFields.map(({ id, val, onChange, ref, max, label }) => (
                        <div key={id} className="rr-time__cell">
                          <input
                            id={id}
                            ref={ref}
                            type="number"
                            inputMode="numeric"
                            min="0"
                            max={max}
                            placeholder="00"
                            aria-label={label}
                            value={val}
                            onChange={(e) => onChange(e.target.value)}
                            className="cc-input rr-time__input"
                          />
                          <span className="rr-time__unit">{label}</span>
                        </div>
                      ))}
                    </div>
                    {error && (
                      <div className="cc-error" role="alert">
                        <AlertCircle size={15} aria-hidden="true" />
                        {error}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="cc-btn cc-btn--gradient rr-submit" disabled={isCalculating}>
                    {isCalculating ? (
                      <>
                        <span className="rr-spinner" aria-hidden="true" />
                        Calcul en cours…
                      </>
                    ) : (
                      <>Calculer mon rang <span className="cc-btn__arrow">→</span></>
                    )}
                  </button>

                  <p className="cc-card__hint rr-hint">Laisse les heures à 0 si tu cours moins d'1 heure.</p>
                </form>
              ) : (
                <ResultCard
                  distance={distance}
                  time={displayedTime}
                  pace={result.pace}
                  percentile={result.percentile}
                  rank={result.rank}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </section>

        {/* Certification Clever Cloud */}
        <CleverCert revealIndex={5} />

        {/* Panneau plateforme : runtime Static */}
        <section className="cc-section" style={{ paddingTop: 0 }}>
          <div className="cc-container">
            <div className="cc-platform cc-reveal" style={reveal(6)}>
              <div className="cc-platform__head">
                <h3>Runtime Static</h3>
                {live ? (
                  <span className="cc-pill cc-pill--ok"><span className="cc-dot" />Production</span>
                ) : (
                  <span className="cc-pill cc-pill--muted"><span className="cc-dot cc-dot--muted" />Local · hors Clever Cloud</span>
                )}
              </div>
              <dl className="cc-kv">
                <div><dt>Runtime</dt><dd>Static</dd></div>
                <div><dt>Webroot</dt><dd>/dist</dd></div>
                <div><dt>Build</dt><dd>vite build · committé</dd></div>
                <div><dt>HTTPS</dt><dd>automatique</dd></div>
              </dl>
              <div className="cc-platform__foot">
                Le runtime Static sert les fichiers du dépôt sans exécuter de code ; le dossier servi se règle avec{" "}
                <span className="cc-kbd">CC_WEBROOT</span> :{" "}
                <a href={STATIC_DOC_URL} target="_blank" rel="noopener">documentation</a>.
              </div>
            </div>
          </div>
        </section>
      </main>

      <CleverFooter
        repoUrl={REPO_URL}
        runtimeDocUrl={STATIC_DOC_URL}
        runtimeDocLabel="Runtime Static"
        extraDocs={[
          { label: "Variables d'environnement", href: "https://www.clever.cloud/developers/doc/reference/reference-environment-variables/" },
        ]}
      />
    </>
  );
}
