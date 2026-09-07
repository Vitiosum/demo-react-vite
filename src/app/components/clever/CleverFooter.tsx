import { CleverLogo } from "./CleverLogo";

interface FooterLink {
  label: string;
  href: string;
}

interface CleverFooterProps {
  /** Dépôt GitHub de la démo. */
  repoUrl: string;
  /** Documentation du runtime Clever Cloud utilisé. */
  runtimeDocUrl: string;
  runtimeDocLabel: string;
  /** Liens de documentation supplémentaires (add-on, etc.). */
  extraDocs?: FooterLink[];
}

export function CleverFooter({ repoUrl, runtimeDocUrl, runtimeDocLabel, extraDocs = [] }: CleverFooterProps) {
  return (
    <footer className="cc-footer">
      <div className="cc-container">
        <div className="cc-footer__inner">
          <div className="cc-footer__brand">
            <CleverLogo />
            <p>PaaS européen entièrement managé. Déployez en git push, la plateforme s'occupe du reste.</p>
            <div className="cc-trust">
              <span>ISO 27001</span>
              <span>HDS</span>
              <span>HÉBERGÉ EN FRANCE</span>
            </div>
          </div>
          <div>
            <h4>Documentation</h4>
            <ul>
              <li>
                <a href={runtimeDocUrl} target="_blank" rel="noopener">{runtimeDocLabel}</a>
              </li>
              {extraDocs.map((doc) => (
                <li key={doc.href}>
                  <a href={doc.href} target="_blank" rel="noopener">{doc.label}</a>
                </li>
              ))}
              <li>
                <a href="https://console.clever-cloud.com" target="_blank" rel="noopener">Console Clever Cloud</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Aller plus loin</h4>
            <ul>
              <li>
                <a className="is-cert" href="https://academy.clever.cloud/" target="_blank" rel="noopener">Certification Clever Cloud ↗</a>
              </li>
              <li>
                <a href={repoUrl} target="_blank" rel="noopener">Code source sur GitHub</a>
              </li>
              <li>
                <a href="https://www.clever.cloud" target="_blank" rel="noopener">clever.cloud</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="cc-footer__bottom">
          <span>Démo réalisée par l'équipe avant-vente Clever Cloud</span>
          <span>© 2026 Clever Cloud</span>
        </div>
      </div>
    </footer>
  );
}
