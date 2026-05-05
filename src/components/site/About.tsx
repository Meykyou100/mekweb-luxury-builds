import { Check, Clock, MapPin, MessageCircle, MonitorSmartphone, Search, Sparkles, Wrench } from "lucide-react";

const benefits = [
  { icon: Sparkles, title: "Design moderne et professionnel" },
  { icon: MonitorSmartphone, title: "Site responsive mobile/tablette/ordinateur" },
  { icon: Search, title: "Optimisation pour Google" },
  { icon: MessageCircle, title: "Contact WhatsApp intégré" },
  { icon: Clock, title: "Livraison rapide" },
  { icon: Wrench, title: "Support après livraison" },
];

export const About = () => {
  return (
    <section id="about" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div data-reveal="left">
            <p className="eyebrow mb-4">Pourquoi MekWeb</p>
            <h2 className="section-title mb-5">Pourquoi choisir MekWeb ?</h2>
            <p className="section-copy mb-6">
              MekWeb crée des sites web professionnels pour les entreprises au Maroc avec une approche claire : inspirer confiance, expliquer vos services et faciliter le contact.
            </p>
            <div className="premium-card flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-gold">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-foreground sm:text-base">
                Basé au Maroc, avec une communication directe et un suivi simple.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} data-reveal="scale" data-reveal-delay={index * 90}>
                <div className="premium-card flex h-full items-start gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                    <benefit.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                      {benefit.title}
                    </h3>
                    <Check className="mt-3 h-4 w-4 text-gold" strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
