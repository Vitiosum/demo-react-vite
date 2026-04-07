export type RankType =
  | "Iron" | "Bronze" | "Silver" | "Gold" | "Platinum"
  | "Diamond" | "Master" | "Grandmaster" | "Challenger";

interface RankConfig {
  name: RankType;
  color: string;
  emoji: string;
  message: string;
}

export const rankConfigs: Record<RankType, RankConfig> = {
  Iron:        { name: "Iron",        color: "#6E7179", emoji: "🏅", message: "Débute ton aventure — continue de courir !" },
  Bronze:      { name: "Bronze",      color: "#CD7F32", emoji: "🥉", message: "Coureur débutant — tu progresses bien !" },
  Silver:      { name: "Silver",      color: "#B0B8C0", emoji: "🥈", message: "Coureur régulier — beau travail !" },
  Gold:        { name: "Gold",        color: "#FFD700", emoji: "🥇", message: "Bon coureur — performance solide !" },
  Platinum:    { name: "Platinum",    color: "#00CED1", emoji: "🏆", message: "Coureur avancé — excellent niveau !" },
  Diamond:     { name: "Diamond",     color: "#4169E1", emoji: "💎", message: "Coureur d'élite — impressionnant !" },
  Master:      { name: "Master",      color: "#9B30FF", emoji: "👑", message: "Athlète confirmé — performance exceptionnelle !" },
  Grandmaster: { name: "Grandmaster", color: "#DC143C", emoji: "⭐", message: "Athlète de très haut niveau — remarquable !" },
  Challenger:  { name: "Challenger",  color: "#00FFFF", emoji: "⚡", message: "Niveau compétiteur — élite absolue !" },
};

interface RankBadgeProps {
  rank: RankType;
  size?: "small" | "large";
}

export function RankBadge({ rank, size = "large" }: RankBadgeProps) {
  const config = rankConfigs[rank];

  if (size === "small") {
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
        style={{
          backgroundColor: `${config.color}18`,
          borderLeft: `3px solid ${config.color}`,
          color: config.color,
        }}
      >
        <span>{config.emoji}</span>
        <span>{rank}</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-4 px-8 py-9 text-center"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${config.color}12 0%, transparent 65%)`,
      }}
    >
      {/* Pulsing ring + emoji */}
      <div className="relative">
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-15"
          style={{ background: config.color }}
        />
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 88, height: 88,
            background: `${config.color}18`,
            border: `1px solid ${config.color}35`,
            boxShadow: `0 0 40px ${config.color}30`,
            fontSize: 40,
          }}
        >
          {config.emoji}
        </div>
      </div>

      {/* Rank name */}
      <div>
        <h2
          className="leading-none tracking-wider"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 84,
            color: config.color,
            textShadow: `0 0 40px ${config.color}45`,
          }}
        >
          {rank}
        </h2>
        <p className="mt-3 text-[13.5px]" style={{ color: "#4E5468" }}>
          {config.message}
        </p>
      </div>
    </div>
  );
}
