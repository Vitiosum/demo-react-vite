import { CleverBadge } from "./CleverBadge";

// Bloc certification Clever Cloud Academy : la médaille du podium, juste sous le stade.
// Le badge SVG porte des id : une seule inclusion par page.
export function CleverCert() {
  return (
    <section className="cc-container">
      <div className="rr-cert" aria-labelledby="cert-title">
        <div className="rr-medal">
          <svg className="rr-medal__ribbon" viewBox="0 0 160 120" aria-hidden="true">
            <defs>
              <linearGradient id="rrRibbon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f57461" />
                <stop offset="0.5" stopColor="#cb1c42" />
                <stop offset="1" stopColor="#a51050" />
              </linearGradient>
            </defs>
            <path d="M18 0h40l40 120H58z" fill="url(#rrRibbon)" />
            <path d="M142 0h-40L62 120h40z" fill="url(#rrRibbon)" opacity="0.82" />
            <path d="M58 0h4l40 120h-4z M102 0h-4L58 120h4z" fill="#fff" opacity="0.22" />
          </svg>
          <CleverBadge />
          <span className="rr-podium" aria-hidden="true">
            <i>2</i>
            <i>1</i>
            <i>3</i>
          </span>
        </div>
        <div>
          <h2 id="cert-title">Cette app tourne sur Clever Cloud. Vous aussi, certifiez-vous.</h2>
          <p className="rr-cert__lead">
            Deux parcours officiels de la Clever Cloud Academy, gratuits et en ligne. À la clé : un badge vérifiable à
            afficher sur LinkedIn.
          </p>
          <div className="rr-cert__tracks">
            <a href="https://academy.clever.cloud/course/view.php?id=2" target="_blank" rel="noopener">
              <b>Cloud Computing Fundamentals</b>
              <span>Concepts, architectures, IaaS, PaaS et FaaS.</span>
            </a>
            <a href="https://academy.clever.cloud/course/section.php?id=18" target="_blank" rel="noopener">
              <b>Advanced Deployment</b>
              <span>Déployer, configurer et opérer une app comme celle-ci.</span>
            </a>
          </div>
          <div className="rr-cert__cta">
            <a className="cc-btn cc-btn--gradient" href="https://academy.clever.cloud/" target="_blank" rel="noopener">
              Passer la certification
            </a>
            <small>academy.clever.cloud</small>
          </div>
        </div>
      </div>
    </section>
  );
}
