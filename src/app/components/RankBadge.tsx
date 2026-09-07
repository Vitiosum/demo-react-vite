export type RankType =
  | "Iron" | "Bronze" | "Silver" | "Gold" | "Platinum"
  | "Diamond" | "Master" | "Grandmaster" | "Challenger";

interface RankConfig {
  name: RankType;
  color: string;
  emoji: string;
  message: string;
}

// Couleurs propres aux rangs (conservées telles quelles : elles font partie du jeu RunRank).
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
      <span
        className="rr-rank-chip"
        style={{ color: config.color, background: `${config.color}18`, borderColor: `${config.color}55` }}
      >
        <span aria-hidden="true">{config.emoji}</span>
        <span>{rank}</span>
      </span>
    );
  }

  return (
    <div
      className="rr-rank"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${config.color}1f 0%, transparent 65%)` }}
    >
      <div className="rr-rank__ring">
        <span className="rr-rank__ping" style={{ background: config.color }} />
        <div
          className="rr-rank__emoji"
          style={{
            background: `${config.color}1a`,
            borderColor: `${config.color}55`,
            boxShadow: `0 0 40px ${config.color}30, 0 0 80px ${config.color}12`,
          }}
        >
          {config.emoji}
        </div>
      </div>
      <div>
        <h2 className="rr-rank__name" style={{ color: config.color, textShadow: `0 0 40px ${config.color}40` }}>
          {rank}
        </h2>
        <p className="rr-rank__msg">{config.message}</p>
      </div>
    </div>
  );
}
