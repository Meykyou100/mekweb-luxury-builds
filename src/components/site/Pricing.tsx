import { CalendarClock, Check, Crown, RefreshCw, Rocket, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Pack Essentiel",
    price: "1500 DH",
    desc: "Un site vitrine professionnel pour présenter votre activité et recevoir des contacts.",
    icon: Sparkles,
    bestFor: "Idéal pour démarrer",
    delivery: "5-7 jours",
    revisions: "1 série",
    support: "7 jours",
    features: [
      "Site responsive",
      "Sections accueil, services et contact",
      "Boutons WhatsApp et email",
      "SEO de base",
      "Mise en ligne guidée",
    ],
  },
  {
    name: "Pack Business",
    price: "2500 DH",
    desc: "Un site plus complet pour convertir les visiteurs en demandes de devis.",
    icon: Rocket,
    popular: true,
    bestFor: "Idéal pour entreprises en croissance",
    delivery: "7-12 jours",
    revisions: "2 séries",
    support: "14 jours",
    features: [
      "Tout le Pack Essentiel",
      "Jusqu'à 5 sections personnalisées",
      "Réalisations ou galerie",
      "Formulaire de contact",
      "Structure orientée conversion",
    ],
  },
  {
    name: "Pack E-commerce",
    price: "Sur devis",
    desc: "Une boutique en ligne moderne pour vendre vos produits au Maroc.",
    icon: Crown,
    bestFor: "Idéal pour boutiques en ligne",
    delivery: "Selon projet",
    revisions: "Sur mesure",
    support: "30 jours",
    features: [
      "Catalogue produits",
      "Pages catégories",
      "Parcours d'achat clair",
      "Base SEO e-commerce",
      "Accompagnement lancement",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <div data-reveal="scale">
            <p className="eyebrow mb-4">Tarifs</p>
            <h2 className="section-title">
              Packs de création site web
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              Des tarifs clairs pour création site web Maroc, site vitrine et site e-commerce Maroc. Chaque pack reste responsive et orienté contact.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {plans.map((plan, i) => (
            <article
              key={plan.name}
              data-reveal="scale"
              data-reveal-delay={i * 120}
              className={`premium-card motion-card group relative flex h-full flex-col p-5 sm:p-6 lg:p-7 ${
                plan.popular ? "border-gold/80 shadow-gold-soft ring-2 ring-gold/35 xl:-translate-y-3" : ""
              }`}
            >
              <div className="mb-6 flex min-h-12 items-start justify-between gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-gold shadow-gold-soft transition-transform duration-700 group-hover:scale-105">
                  <plan.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                </div>
                {plan.popular && (
                  <span className="rounded-full border border-gold/50 bg-gold/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-gold shadow-gold-soft">
                    Le plus choisi
                  </span>
                )}
              </div>

              <h3 className="font-display text-3xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="font-number text-5xl font-bold text-foreground">{plan.price}</span>
                {plan.price !== "Sur devis" && <span className="ml-1 text-sm text-muted-foreground">à partir de</span>}
              </div>
              <p className="text-base text-muted-foreground leading-7 mb-6">{plan.desc}</p>

              <div className="grid gap-3 mb-6 rounded-2xl border border-border/60 bg-background/45 p-4">
                <div className="text-sm font-medium text-gold">{plan.bestFor}</div>
                <div className="grid gap-2 text-base text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-gold" />
                    Délai: <span className="font-number">{plan.delivery}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-gold" />
                    Révisions: <span className="font-number">{plan.revisions}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-gold" />
                    Support: <span className="font-number">{plan.support}</span>
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-base leading-7 text-foreground/90">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/20 grid place-items-center shrink-0">
                      <Check className="w-3 h-3 text-gold" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.popular ? "hero" : "outlineGold"} size="lg" className="h-auto min-h-12 w-full whitespace-normal px-5 py-4 text-center">
                <a href="#contact">Demander un devis</a>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" data-reveal="scale">
          {[
            ["Paiement", "Le projet peut commencer avec une avance, puis le reste avant la mise en ligne."],
            ["Domaine & hébergement", "Nous pouvons vous guider pour connecter votre domaine et votre hébergement."],
            ["Propriété", "Après paiement final, les accès et fichiers du site vous appartiennent."],
          ].map(([title, text]) => (
            <div key={title} className="premium-card p-5">
              <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
