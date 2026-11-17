import {
  ArrowUpRight,
  Clock,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
const benefits = [
  {
    icon: Sparkles,
    title: "Design moderne et professionnel",
    description: "Une identité soignée, au service de votre activité.",
  },
  {
    icon: MonitorSmartphone,
    title: "Site responsive mobile/tablette/ordinateur",
    description: "Une expérience claire, sur chaque écran.",
  },
  {
    icon: Search,
    title: "Optimisation pour Google",
    description: "Des bases techniques pensées dès la conception.",
  },
  {
    icon: MessageCircle,
    title: "Contact WhatsApp intégré",
    description: "Un échange direct avec vos futurs clients.",
  },
  {
    icon: Clock,
    title: "Livraison rapide",
    description: "Des étapes définies ensemble, un suivi transparent.",
  },
  {
    icon: Wrench,
    title: "Support après livraison",
    description: "Un accompagnement qui se poursuit après la mise en ligne.",
  },
];
export const About = () => (
  <section id="about" className="section-pad about-section">
    <div className="container-luxe">
      <div className="about-intro">
        <div data-reveal>
          <p className="eyebrow">03 / Le studio</p>
          <h2 className="section-title">
            De la première idée
            <br />
            au dernier <em>détail.</em>
          </h2>
        </div>
        <div data-reveal>
          <p className="section-copy">
            MekWeb crée des sites web professionnels pour les entreprises au
            Maroc avec une approche claire : inspirer confiance, expliquer vos
            services et faciliter le contact.
          </p>
          <p className="location-note">
            <MapPin size={16} /> Basé au Maroc, avec une communication directe
            et un suivi simple.
          </p>
        </div>
      </div>
      <div className="studio-manifesto" data-reveal>
        <span className="manifesto-mark" aria-hidden="true">
          M<span>W</span>
        </span>
        <div>
          <p className="eyebrow">Pourquoi choisir MekWeb ?</p>
          <p>
            Votre projet mérite
            <br />
            <em>plus qu’un site.</em>
            <br />
            Une vraie attention.
          </p>
          <a className="text-link" href="#contact">
            Rencontrons-nous <ArrowUpRight size={17} />
          </a>
        </div>
        <span className="manifesto-aside">
          L’écoute comme point de départ.
          <br />
          La qualité comme fil conducteur.
        </span>
      </div>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <article
            key={benefit.title}
            data-reveal
            data-reveal-delay={(index % 3) * 60}
          >
            <benefit.icon size={23} strokeWidth={1.3} />
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
