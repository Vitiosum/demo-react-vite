import { useState, useRef } from "react";
import { DistanceSelector } from "./components/DistanceSelector";
import { ResultCard } from "./components/ResultCard";
import { Footer } from "./components/Footer";
import { calculateRunResult } from "./utils/calculations";
import { AlertCircle } from "lucide-react";

const ACCENT = "#FF5A1F";

export default function App() {
  const [distance, setDistance] = useState("10");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateRunResult>>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const h = parseInt(hours || "0", 10);
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

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#07080C", fontFamily: "var(--font-body)" }}>
      <div className="mx-auto px-5 py-12 md:py-16" style={{ maxWidth: 460 }}>
        {!result ? (
          <div className="space-y-3 animate-in fade-in duration-500">

            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div
                  className="relative flex items-center justify-center flex-shrink-0 rounded-[10px]"
                  style={{
                    width: 46, height: 46,
                    background: "rgba(255,90,31,0.1)",
                    border: "1px solid rgba(255,90,31,0.22)",
                    color: ACCENT,
                  }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ background: ACCENT }}
                  >
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-60"
                      style={{ background: ACCENT }}
                    />
                  </span>
                </div>
                <h1
                  className="leading-none tracking-wide"
                  style={{ fontFamily: "var(--font-display)", fontSize: 54, color: "#E6E8F0" }}
                >
                  RUN<span style={{ color: ACCENT }}>RANK</span>
                </h1>
              </div>
              <p className="text-sm pl-[60px]" style={{ color: "#4E5468" }}>
                Classe ton niveau comme sur League of Legends
              </p>
            </div>

            {/* Form Card */}
            <div
              className="rounded-2xl p-7 space-y-7"
              style={{ background: "#0C0E13", border: "1px solid #1A1D26" }}
            >
              {/* Distance */}
              <div className="space-y-3">
                <label
                  className="block text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "#4E5468" }}
                >
                  Distance
                </label>
                <DistanceSelector value={distance} onChange={setDistance} />
              </div>

              {/* Time */}
              <div className="space-y-3">
                <label
                  className="block text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "#4E5468" }}
                >
                  Ton temps
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "hours", val: hours, onChange: handleHoursChange, ref: undefined, max: 24, label: "Heures" },
                    { id: "minutes", val: minutes, onChange: handleMinutesChange, ref: minutesRef, max: 59, label: "Minutes" },
                    { id: "seconds", val: seconds, onChange: (v: string) => setSeconds(v), ref: secondsRef, max: 59, label: "Secondes" },
                  ].map(({ id, val, onChange, ref, max, label }) => (
                    <div key={id} className="flex flex-col items-center gap-2">
                      <input
                        ref={ref}
                        type="number"
                        min="0"
                        max={max}
                        placeholder="00"
                        value={val}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full rounded-[10px] text-center transition-all duration-150"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid #1A1D26",
                          color: "#E6E8F0",
                          fontFamily: "var(--font-mono)",
                          fontSize: 28,
                          fontWeight: 500,
                          padding: "14px 8px",
                          outline: "none",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = ACCENT;
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,90,31,0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#1A1D26";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                        style={{ color: "#4E5468" }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 text-sm rounded-lg px-3 py-2.5"
                    style={{
                      color: "#F87171",
                      background: "rgba(239,68,68,0.07)",
                      border: "1px solid rgba(239,68,68,0.18)",
                    }}
                  >
                    <AlertCircle size={13} className="shrink-0" />
                    {error}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCalculating}
                onClick={handleCalculate}
                className="w-full rounded-[10px] font-semibold text-[15px] text-white transition-all duration-150 flex items-center justify-center gap-2.5 disabled:opacity-55"
                style={{
                  background: ACCENT,
                  padding: "16px",
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  if (!isCalculating) {
                    e.currentTarget.style.background = "#E8491A";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,90,31,0.22)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = ACCENT;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {isCalculating ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: "rgba(255,255,255,0.25)", borderTopColor: "white" }}
                    />
                    Calcul en cours…
                  </>
                ) : (
                  "Calculer mon rang"
                )}
              </button>
            </div>

            <p className="text-center text-xs" style={{ color: "#4E5468", paddingTop: 4 }}>
              Laisse les heures à 0 si tu cours moins d'1 heure
            </p>

            <Footer />
          </div>
        ) : (
          <ResultCard
            distance={distance}
            time={
              hours
                ? `${hours}:${String(minutes || "0").padStart(2, "0")}:${String(seconds || "0").padStart(2, "0")}`
                : `${minutes}:${String(seconds || "0").padStart(2, "0")}`
            }
            pace={result.pace}
            percentile={result.percentile}
            rank={result.rank}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
