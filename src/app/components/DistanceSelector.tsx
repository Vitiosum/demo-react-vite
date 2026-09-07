interface DistanceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const distances = [
  { value: "5",  label: "5K",       subtitle: "~25–35 min" },
  { value: "10", label: "10K",      subtitle: "~50–70 min" },
  { value: "21", label: "Semi",     subtitle: "~1h45–2h30" },
  { value: "42", label: "Marathon", subtitle: "~3h30–5h"   },
];

export function DistanceSelector({ value, onChange }: DistanceSelectorProps) {
  return (
    <div className="rr-dist" role="radiogroup" aria-label="Distance">
      {distances.map((d) => {
        const active = value === d.value;
        return (
          <button
            key={d.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={active ? "rr-dist__btn is-active" : "rr-dist__btn"}
            onClick={() => onChange(d.value)}
          >
            <span className="rr-dist__label">{d.label}</span>
            <span className="rr-dist__sub">{d.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}
