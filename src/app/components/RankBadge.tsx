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
