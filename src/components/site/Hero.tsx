import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import project from "@/assets/portfolio/parapharmacie-concept.webp";
import secondProject from "@/assets/portfolio/climatisation-concept.webp";
import background from "@/assets/home-studio-background.webp";
import backgroundMobile from "@/assets/home-studio-background-mobile.webp";

export const Hero = () => (
  <section id="home" className="studio-hero">
    <div className="hero-backdrop" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" srcSet={backgroundMobile} />
        <img
          src={background}
          alt=""
          width={1920}
          height={1080}
          decoding="async"
        />
      </picture>
    </div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="container-luxe">
      <div className="hero-topline">
        <span>
          <span className="status-dot" /> Studio digital indépendant
        </span>
        <span>Rabat, Maroc — Au service de votre ambition</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-enter">Création de sites web au Maroc</p>
          <h1 className="hero-heading">
            <span className="hero-line">
              <span>Votre ambition.</span>
            </span>{" "}
            <span className="hero-line">
              <span>
                Notre <em>signature</em>
              </span>
            </span>{" "}
            <span className="hero-line">
              <span>digitale.</span>
            </span>
          </h1>
          <p className="hero-description hero-enter">
            MekWeb aide les entreprises locales à obtenir un site professionnel,
            rapide et responsive pour attirer plus de clients et améliorer leur
            présence en ligne.
          </p>
          <div className="hero-actions hero-enter">
            <Button asChild variant="hero" size="lg">
              <a href="#contact">
                Demander un devis <ArrowUpRight />
              </a>
            </Button>
            <a className="text-link" href="#portfolio">
              Voir nos réalisations <ArrowDown size={16} />
            </a>
          </div>
          <div className="hero-expertise hero-enter">
            <span>Design sur mesure</span>
            <span>Développement responsive</span>
            <span>Suivi personnalisé</span>
          </div>
        </div>
        <div
          className="hero-art hero-enter"
          aria-label="Aperçu des concepts visuels de notre portfolio"
        >
          <div className="art-orbit" aria-hidden="true" />
          <div className="art-caption">
            <span>Une présence à votre image.</span>
            <span>MW — Studio</span>
          </div>
          <a
            href="#portfolio"
            className="hero-project hero-project-primary"
            aria-label="Découvrir notre sélection de concepts visuels"
          >
            <div className="browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <i>mekweb — création digitale</i>
              <ArrowUpRight size={14} />
            </div>
            <img
              src={project}
              width={1448}
              height={1086}
              alt="Concept visuel de boutique de parapharmacie MekWeb"
              loading="eager"
            />
            <div className="project-strip">
              <span>Concept visuel. Design web. Détail.</span>
              <ArrowUpRight size={18} />
            </div>
          </a>
          <div className="hero-project hero-project-secondary">
            <img
              src={secondProject}
              width={1448}
              height={1086}
              alt="Concept visuel de site de climatisation MekWeb"
              decoding="async"
            />
            <span>Des idées aux expériences.</span>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#services">
          <ArrowDown size={15} /> Explorer le studio
        </a>
        <p>
          Des sites pensés pour votre activité.
          <br />
          <span>Et pour les personnes qui la font vivre.</span>
        </p>
        <span className="hero-index">01 — MEKWEB AGENCY</span>
      </div>
    </div>
  </section>
);
