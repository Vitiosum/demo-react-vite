interface DistanceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const distances = [
  { value: "5",       label: "5K",       subtitle: "5 km",      short: "5 km" },
  { value: "10",      label: "10K",      subtitle: "10 km",     short: "10 km" },
  { value: "21.0975", label: "Semi",     subtitle: "21,1 km",   short: "semi" },
  { value: "42.195",  label: "Marathon", subtitle: "42,195 km", short: "marathon" },
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
