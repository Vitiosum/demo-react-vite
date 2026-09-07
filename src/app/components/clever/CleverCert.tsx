import type { CSSProperties } from "react";
import { CleverBadge } from "./CleverBadge";

interface CleverCertProps {
  /** Index d'animation `.cc-reveal` (délai = index × 90 ms). */
  revealIndex?: number;
}

export function CleverCert({ revealIndex = 0 }: CleverCertProps) {
  return (
    <section className="cc-section">
      <div className="cc-container">
        <div className="cc-cert cc-reveal" style={{ "--i": revealIndex } as CSSProperties}>
          <CleverBadge />
          <div>
            <div className="cc-cert__kicker">Clever Cloud Academy</div>
            <h2 className="cc-cert__title">
              Devenez <span className="cc-grad-text">certifié Clever Cloud</span>
            </h2>
            <p className="cc-cert__text">
              Deux parcours officiels, de la théorie au déploiement avancé. Le badge numérique est délivré
              automatiquement dès la validation.
            </p>
            <div className="cc-tracks">
              <a className="cc-track" href="https://academy.clever.cloud/course/view.php?id=2" target="_blank" rel="noopener">
                <span className="cc-track__num">01</span>
                <span>
                  <span className="cc-track__name">Cloud Computing Fundamentals</span>
                  <br />
                  <span className="cc-track__desc">Concepts, architectures, modèles IaaS · PaaS · FaaS.</span>
                </span>
              </a>
              <a className="cc-track" href="https://academy.clever.cloud/course/section.php?id=18" target="_blank" rel="noopener">
                <span className="cc-track__num">02</span>
                <span>
                  <span className="cc-track__name">Advanced Deployment</span>
                  <br />
                  <span className="cc-track__desc">Maîtriser le déploiement d'applications sur Clever Cloud.</span>
                </span>
              </a>
            </div>
            <div className="cc-cert__actions">
              <a className="cc-btn cc-btn--gradient" href="https://academy.clever.cloud/" target="_blank" rel="noopener">
                Obtenir ma certification <span className="cc-btn__arrow">→</span>
              </a>
              <span className="cc-cert__note">academy.clever.cloud · développeurs, partenaires, équipes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
