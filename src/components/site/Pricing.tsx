import { Check, Crown, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "1000 DH",
    desc: "A clean one-page website for a new business or simple offer.",
    icon: Sparkles,
    features: [
      "One-page responsive website",
      "Hero, services, about, and contact sections",
      "WhatsApp and email buttons",
      "Basic SEO setup",
      "Delivery in 5-7 days",
    ],
  },
  {
    name: "Business",
    price: "1500 DH",
    desc: "A stronger website with more content, animation, and conversion sections.",
    icon: Rocket,
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 5 custom sections",
      "Smooth animations",
      "Portfolio or gallery section",
      "Contact form and lead-focused layout",
    ],
  },
  {
    name: "Premium",
    price: "2500 DH",
    desc: "A complete polished website for brands that want a premium online presence.",
    icon: Crown,
    features: [
      "Everything in Business",
      "Advanced landing page structure",
      "Extra revisions and content support",
      "Performance and SEO polish",
      "Launch support and final cleanup",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative py-20 sm:py-24 lg:py-32 bg-secondary/30">
      <div className="container-luxe">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl" data-reveal="left">
            <p className="text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gold mb-4">Pricing</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Choose the package that <span className="text-gradient-gold italic">fits</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md" data-reveal="right" data-reveal-delay="120">
            Simple starting prices in Moroccan dirhams. Every package is mobile-friendly and built to help you get more clients.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <article
              key={plan.name}
              data-reveal="scale"
              data-reveal-delay={i * 120}
              className={`motion-card group relative flex h-full flex-col rounded-2xl sm:rounded-3xl bg-card-gradient border p-5 sm:p-6 lg:p-8 shadow-elegant transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-soft ${
                plan.popular ? "border-gold/60" : "border-border/60 hover:border-gold/40"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-5 top-5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold">
                  Popular
                </span>
              )}

              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-gold grid place-items-center mb-6 shadow-gold-soft group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <plan.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="font-display text-4xl sm:text-5xl font-bold text-gradient-gold">{plan.price}</span>
                <span className="text-sm text-muted-foreground"> / starting</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{plan.desc}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm sm:text-base text-foreground/90">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 grid place-items-center shrink-0">
                      <Check className="w-3 h-3 text-gold" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.popular ? "hero" : "outlineGold"} size="lg" className="h-auto min-h-12 w-full whitespace-normal px-5 py-4 text-center">
                <a href="#contact">Start with {plan.name}</a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
