import { CleverLogo } from "./CleverLogo";

interface CleverTopbarProps {
  /** Nom de la démo affiché à côté du logo. */
  demo: string;
  /** Pill mono décrivant la stack, ex. « React 18 · Vite 8 · Static ». */
  stack: string;
  /** true si l'app tourne sur Clever Cloud (APP_ID présent dans config.json). */
  live: boolean;
}

export function CleverTopbar({ demo, stack, live }: CleverTopbarProps) {
  return (
    <header className="cc-topbar">
      <div className="cc-container cc-topbar__inner">
        <a href="https://www.clever.cloud" target="_blank" rel="noopener" aria-label="Clever Cloud">
          <CleverLogo />
        </a>
        <span className="cc-topbar__sep" />
        <a className="cc-topbar__demo" href="#top">
          <small>Démo</small>
          {demo}
        </a>
        <span className="cc-topbar__spacer" />
        <nav className="cc-topbar__nav" aria-label="Navigation">
          <a className="cc-topbar__link" href="#top">Allure</a>
          <a className="cc-topbar__link" href="#config">Variables</a>
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
