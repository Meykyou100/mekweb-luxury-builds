import { CalendarClock, Check, Crown, RefreshCw, Rocket, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "1000 DH",
    desc: "A clean one-page website for a new business or simple offer.",
    icon: Sparkles,
    bestFor: "Best for new businesses",
    delivery: "5-7 days",
    revisions: "1 revision round",
    support: "7 days support",
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
    bestFor: "Best for growing businesses",
    delivery: "7-12 days",
    revisions: "2 revision rounds",
    support: "14 days support",
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
    bestFor: "Best for premium launches",
    delivery: "12-20 days",
    revisions: "3 revision rounds",
    support: "30 days support",
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
    <section id="pricing" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <div data-reveal="scale">
            <p className="eyebrow mb-4">Pricing</p>
            <h2 className="section-title">
              Simple packages, clear outcomes
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              Starting prices in Moroccan dirhams. Every package includes responsive design, launch support, and a conversion-focused structure.
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
                    Most Popular
                  </span>
                )}
              </div>

              <h3 className="font-display text-3xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="font-number text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">starting</span>
              </div>
              <p className="text-base text-muted-foreground leading-7 mb-6">{plan.desc}</p>

              <div className="grid gap-3 mb-6 rounded-2xl border border-border/60 bg-background/45 p-4">
                <div className="text-sm font-medium text-gold">{plan.bestFor}</div>
                <div className="grid gap-2 text-base text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-gold" />
                    Delivery: <span className="font-number">{plan.delivery}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-gold" />
                    Revisions: <span className="font-number">{plan.revisions}</span>
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
                <a href="#contact">Start with {plan.name}</a>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" data-reveal="scale">
          {[
            ["Payment", "Start with a deposit, finish payment before launch."],
            ["Hosting", "We can guide domain and hosting setup if you do not have them yet."],
            ["Ownership", "After final payment, the website files and access belong to you."],
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
