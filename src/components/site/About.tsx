import { Check } from "lucide-react";

const stats = [
  { v: "50+", l: "Projects Delivered" },
  { v: "100%", l: "Client Satisfaction" },
  { v: "4+", l: "Years Experience" },
  { v: "24/7", l: "Support" },
];

const points = [
  "Création site web Maroc orientée clients",
  "Design moderne, rapide et responsive",
  "Structure SEO prête pour Google",
  "Communication claire jusqu'à la mise en ligne",
];

export const About = () => {
  return (
    <section id="about" className="relative section-pad section-surface">
      <div className="container-luxe grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="left">
          <p className="eyebrow mb-4">Pourquoi MekWeb</p>
          <h2 className="section-title mb-5">
            Pourquoi choisir MekWeb
          </h2>
          <p className="section-copy mb-5">
            MekWeb Agency est une agence web Maroc basée à Rabat, spécialisée dans la création de sites web professionnels pour les entreprises locales.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base mb-8">
            Nous travaillons les détails qui inspirent confiance : message clair, pages rapides, design premium, expérience mobile et appels à l'action visibles.
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/55 p-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/20">
                  <Check className="h-3.5 w-3.5 text-gold" strokeWidth={3} />
                </span>
                <span className="text-sm text-foreground/90 sm:text-base">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
          {stats.map((s, i) => (
            <div key={s.l} data-reveal="scale" data-reveal-delay={i * 110}>
              <div className="premium-card p-6 sm:p-7">
                <div className="mb-2 font-number text-4xl font-bold text-gradient-gold sm:text-5xl">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
