import { Headphones, Pencil, Rocket, Search, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    n: "01",
    title: "Analyse de votre activité",
    desc: "Nous comprenons vos services, vos clients et les objectifs du futur site.",
  },
  {
    icon: Pencil,
    n: "02",
    title: "Proposition du design",
    desc: "Nous préparons une direction visuelle moderne, claire et adaptée à votre image.",
  },
  {
    icon: TrendingUp,
    n: "03",
    title: "Développement du site",
    desc: "Le site est construit en version responsive avec des pages rapides et propres.",
  },
  {
    icon: Rocket,
    n: "04",
    title: "Mise en ligne",
    desc: "Nous connectons le domaine, vérifions les pages et préparons le lancement.",
  },
  {
    icon: Headphones,
    n: "05",
    title: "Support et modifications",
    desc: "MekWeb reste disponible pour les ajustements, conseils et améliorations.",
  },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="section-pad">
    <div className="container-luxe">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">04 / Notre méthode</p>
          <h2 className="section-title">
            Une vision partagée.
            <br />
            <em>Un chemin clair.</em>
          </h2>
        </div>
        <p className="section-copy">
          Un processus simple pour passer de l'idée à un site web professionnel
          en ligne.
        </p>
      </div>
      <ol className="process-timeline">
        {steps.map((step, index) => (
          <li key={step.n} data-reveal data-reveal-delay={index * 65}>
            <div className="process-number">
              {step.n}
              <span />
              <step.icon size={19} strokeWidth={1.3} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
