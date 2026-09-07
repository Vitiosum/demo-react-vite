import { CleverLogo } from "./CleverLogo";
import { isLiveOnCleverCloud } from "./platform";

interface CleverTopbarProps {
  /** Nom de la démo affiché à côté du logo. */
  demo: string;
  /** Pill mono décrivant la stack, ex. « React 18 · Vite 8 · Static ». */
  stack: string;
}

export function CleverTopbar({ demo, stack }: CleverTopbarProps) {
  const live = isLiveOnCleverCloud();

  return (
    <header className="cc-topbar">
      <div className="cc-container cc-topbar__inner">
        <a href="https://www.clever.cloud" target="_blank" rel="noopener" aria-label="Clever Cloud">
          <CleverLogo />
        </a>
        <span className="cc-topbar__sep" />
        <div className="cc-topbar__demo">
          <small>Démo</small>
          {demo}
        </div>
        <span className="cc-topbar__spacer" />
        <nav className="cc-topbar__nav" aria-label="Statut">
          <span className="cc-pill cc-pill--mono cc-hide-sm">{stack}</span>
          {live ? (
            <span className="cc-pill cc-pill--live">
              <span className="cc-dot" />
              Live on Clever Cloud
            </span>
          ) : (
            <span className="cc-pill cc-pill--muted">
              <span className="cc-dot cc-dot--muted" />
              Local · hors Clever Cloud
            </span>
          )}
          <a className="cc-pill cc-pill--gradient" href="https://academy.clever.cloud/" target="_blank" rel="noopener">
            Se certifier ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
