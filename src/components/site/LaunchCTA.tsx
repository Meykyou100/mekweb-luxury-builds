import { ArrowUpRight } from "lucide-react";
export const LaunchCTA = () => (
  <section className="launch-section">
    <div className="container-luxe">
      <div className="launch-inner" data-reveal>
        <p className="eyebrow">La suite s’écrit ensemble</p>
        <h2>
          Et si votre prochain
          <br />
          chapitre était <em>digital ?</em>
        </h2>
        <div className="launch-bottom">
          <p>
            Contactez MekWeb aujourd'hui et recevez une proposition adaptée à
            votre activité.<span>Younes Mekki — Fondateur de MekWeb</span>
          </p>
          <a
            href="/devis"
            className="launch-circle"
            aria-label="Demander un devis pour votre site web"
          >
            <ArrowUpRight size={40} strokeWidth={1} />
          </a>
        </div>
      </div>
    </div>
  </section>
);
