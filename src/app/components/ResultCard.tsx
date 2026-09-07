import { useState } from "react";
import { Share2, Check, TrendingUp, RotateCcw } from "lucide-react";
import { RankBadge, RankType, rankConfigs } from "./RankBadge";
import { getNextRank } from "../utils/calculations";
import { reveal } from "./clever/reveal";

interface ResultCardProps {
  distance:   string;
  time:       string;
  pace:       string;
  percentile: number;
  rank:       RankType;
  onReset:    () => void;
}

const distanceLabels: Record<string, string> = {
  "5":  "5 km",
  "10": "10 km",
  "21": "21 km (Semi)",
  "42": "42 km (Marathon)",
};

export function ResultCard({ distance, time, pace, percentile, rank, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const nextRankInfo    = getNextRank(rank);
  const rankColor       = rankConfigs[rank].color;
  const progressPercent = 100 - percentile;

  const handleShare = () => {
    const text = `🏃 ${distanceLabels[distance]} en ${time} · Allure ${pace}/km · Rang ${rank} (Top ${percentile}%) #RunRank`;
    if (navigator.share) {
      navigator.share({ title: "Mon rang RunRank", text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rr-result" aria-live="polite">
      {/* Rang */}
      <div className="cc-card rr-rank-card cc-reveal" style={{ ...reveal(0), borderTop: `2px solid ${rankColor}80` }}>
        <RankBadge rank={rank} size="large" />
      </div>

      {/* Position */}
      <div className="cc-card cc-reveal" style={reveal(1)}>
        <div className="rr-row">
          <span className="cc-card__label">Position parmi les coureurs</span>
          <span className="rr-top" style={{ color: rankColor }}>Top {percentile}%</span>
        </div>
        <div className="rr-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
          <div
            className="rr-bar__fill"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${rankColor}66, ${rankColor})`,
              boxShadow: `0 0 8px ${rankColor}40`,
            }}
          />
        </div>
        <div className="rr-bar__ends">
          <span>Iron</span>
          <span>Challenger</span>
        </div>
      </div>

      {/* Temps + allure */}
      <div className="rr-stats cc-reveal" style={reveal(2)}>
        <div className="cc-card cc-card--accent">
          <div className="cc-card__label">Temps</div>
          <div className="cc-stat">{time}</div>
          <p className="cc-card__hint">{distanceLabels[distance]}</p>
        </div>
        <div className="cc-card cc-card--accent">
          <div className="cc-card__label">Allure</div>
          <div className="cc-stat">{pace}</div>
          <p className="cc-card__hint">min / km</p>
        </div>
      </div>

      {/* Prochain rang */}
      {nextRankInfo && (
        <div className="cc-card rr-next cc-reveal" style={reveal(3)}>
          <div>
            <div className="cc-card__label">Prochain rang</div>
            <div className="cc-flex cc-mt-1">
              <span className="rr-next__rank" style={{ color: rankConfigs[nextRankInfo.rank].color }}>
                {nextRankInfo.rank}
              </span>
              <span className="cc-muted">›</span>
              <span className="rr-next__pace">allure &lt; {nextRankInfo.targetPace}/km</span>
            </div>
          </div>
          <TrendingUp size={18} className="cc-muted" aria-hidden="true" />
        </div>
      )}

      {/* Actions */}
      <div className="rr-actions cc-reveal" style={reveal(4)}>
        <button type="button" className="cc-btn" onClick={handleShare}>
          {copied ? (
            <>
              <Check size={16} className="rr-ok" aria-hidden="true" />
              <span className="rr-ok">Copié !</span>
            </>
          ) : (
            <>
              <Share2 size={16} aria-hidden="true" />
              Partager
            </>
          )}
        </button>
        <button type="button" className="cc-btn cc-btn--gradient" onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          Recalculer
        </button>
      </div>
    </div>
  );
}
