const ACCENT = "#FF5A1F";

interface DistanceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const distances = [
  { value: "5",  label: "5K",       subtitle: "~25–35 min" },
  { value: "10", label: "10K",      subtitle: "~50–70 min" },
  { value: "21", label: "Semi",     subtitle: "~1h45–2h30" },
  { value: "42", label: "Marathon", subtitle: "~3h30–5h" },
];

export function DistanceSelector({ value, onChange }: DistanceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {distances.map((d) => {
        const active = value === d.value;
        return (
          <button
            key={d.value}
            type="button"
            onClick={() => onChange(d.value)}
            className="relative overflow-hidden rounded-[10px] text-left transition-all duration-150"
            style={{
              padding: "14px 16px",
              background: active ? "rgba(255,90,31,0.09)" : "transparent",
              border: active ? "1px solid rgba(255,90,31,0.28)" : "1px solid #1A1D26",
              color: active ? "#E6E8F0" : "#4E5468",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#252830";
                e.currentTarget.style.color = "#E6E8F0";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#1A1D26";
                e.currentTarget.style.color = "#4E5468";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {/* Left accent bar */}
            <span
              className="absolute left-0 top-0 bottom-0 w-[3px] transition-transform duration-150 origin-center"
              style={{
                background: ACCENT,
                transform: active ? "scaleY(1)" : "scaleY(0)",
              }}
            />
            <span
              className="block font-semibold text-[15px] mb-0.5"
              style={{ color: active ? ACCENT : "inherit" }}
            >
              {d.label}
            </span>
            <span
              className="block text-[11px]"
              style={{ fontFamily: "var(--font-mono)", opacity: 0.5 }}
            >
              {d.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}
