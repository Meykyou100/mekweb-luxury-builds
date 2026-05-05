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

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative section-pad">
      <div className="container-luxe">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">Comment ça marche ?</p>
          <h2 className="section-title">
            Comment ça marche ?
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Un processus simple pour passer de l'idée à un site web professionnel en ligne.
          </p>
        </div>

        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <div className="process-line hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

          {steps.map((s, i) => (
            <div
              key={s.n}
              data-reveal="scale"
              data-reveal-delay={i * 140}
              className="premium-card relative p-6 text-center group"
            >
              <div className="relative mx-auto mb-6 h-20 w-20">
                <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-gold/25 bg-gold/10 shadow-gold-soft transition-all duration-700 group-hover:scale-105 group-hover:border-gold">
                  <s.icon className="h-8 w-8 text-gold" strokeWidth={1.5} />
                </div>
                <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-gradient-gold font-display text-xs font-bold text-primary-foreground shadow-gold-soft">
                  {s.n}
                </span>
              </div>
              <h3 className="mb-3 font-display text-xl font-bold transition-colors group-hover:text-gold sm:text-2xl">
                {s.title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-base">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
