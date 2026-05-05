import { Check, Crown, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Pack Essentiel",
    price: "à partir de 1500 DH",
    icon: Sparkles,
    features: [
      "Site vitrine simple",
      "Design responsive",
      "Formulaire de contact",
      "Bouton WhatsApp",
    ],
  },
  {
    name: "Pack Business",
    price: "à partir de 2500 DH",
    icon: Rocket,
    popular: true,
    features: [
      "Site complet multi-pages",
      "Design premium",
      "SEO de base",
      "Intégration Google Maps",
      "Support après livraison",
    ],
  },
  {
    name: "Pack E-commerce",
    price: "sur devis",
    icon: Crown,
    features: [
      "Boutique en ligne",
      "Gestion des produits",
      "Panier / commandes",
      "Admin panel si nécessaire",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">Tarifs</p>
          <h2 className="section-title">Packs de création site web</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Des offres simples pour démarrer avec un site professionnel, puis évoluer selon votre activité.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              data-reveal="scale"
              data-reveal-delay={index * 100}
              className={`premium-card motion-card relative flex h-full flex-col p-6 sm:p-7 ${
                plan.popular ? "border-gold/80 ring-2 ring-gold/25" : ""
              }`}
            >
              {plan.popular && (
                <span className="mb-5 inline-flex w-fit rounded-full border border-gold/50 bg-gold/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-gold">
                  Le plus demandé
                </span>
              )}
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold text-black shadow-gold-soft">
                <plan.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-display text-3xl font-bold text-foreground">
                {plan.name}
              </h3>
              <p className="font-number mb-6 text-3xl font-black text-gold">
                {plan.price}
              </p>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-base leading-7 text-foreground/90">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20">
                      <Check className="h-3 w-3 text-gold" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.popular ? "hero" : "outlineGold"} size="lg" className="h-auto min-h-12 w-full px-5 py-4">
                <a href="#contact">Demander ce pack</a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
