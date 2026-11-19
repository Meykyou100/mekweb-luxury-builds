import { ArrowUpRight, Check, Crown, Rocket, Sparkles } from "lucide-react";
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

export const Pricing = () => (
  <section id="pricing" className="section-pad pricing-section">
    <div className="container-luxe">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">05 / Un investissement clair</p>
          <h2 className="section-title">
            À chaque ambition,
            <br />
            <em>son point de départ.</em>
          </h2>
        </div>
        <p className="section-copy">
          Des offres simples pour démarrer avec un site professionnel, puis
          évoluer selon votre activité.
        </p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`price-card ${plan.popular ? "price-recommended" : ""}`}
            data-reveal
            data-reveal-delay={index * 70}
          >
            <div className="price-top">
              <plan.icon size={24} strokeWidth={1.4} />
              {plan.popular ? (
                <span>Recommandé</span>
              ) : (
                <span>0{index + 1}</span>
              )}
            </div>
            <h3>{plan.name}</h3>
            <p className="price-value">
              {plan.price.startsWith("à partir") && <small>à partir de</small>}
              {plan.price.replace("à partir de ", "")}
            </p>
            <div className="price-rule" />
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} strokeWidth={1.5} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={plan.popular ? "hero" : "outlineGold"}
              size="lg"
              className="w-full"
            >
              <a href={`/devis?pack=${["essential", "business", "ecommerce"][index]}`}>
                Configurer mon projet <ArrowUpRight size={16} />
              </a>
            </Button>
          </article>
        ))}
      </div>
    </div>
  </section>
);
