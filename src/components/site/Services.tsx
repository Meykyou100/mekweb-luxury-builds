import { Code2, Palette, Search, ShoppingBag, RefreshCw, Smartphone } from "lucide-react";

const services = [
  { icon: Code2, title: "Site vitrine professionnel", benefit: "Une présence claire pour votre entreprise au Maroc", desc: "Création site web Maroc pour présenter vos services, rassurer vos visiteurs et générer des demandes de devis." },
  { icon: ShoppingBag, title: "Site e-commerce Maroc", benefit: "Vendre vos produits avec une boutique moderne", desc: "Un site e-commerce Maroc responsive, rapide et pensé pour inspirer confiance au moment de l'achat." },
  { icon: RefreshCw, title: "Refonte de site web", benefit: "Moderniser un site ancien sans perdre votre identité", desc: "Nous améliorons design, mobile, messages, SEO et vitesse pour transformer votre site en outil commercial." },
  { icon: Search, title: "SEO Optimization", benefit: "Être plus visible sur Google", desc: "Structure SEO, balises, performance et contenus optimisés pour agence web Maroc, site web Rabat et vos services." },
  { icon: Palette, title: "UI / UX Design", benefit: "Un design premium qui guide vers l'action", desc: "Des interfaces propres, modernes et faciles à utiliser pour aider vos visiteurs à vous contacter." },
  { icon: Smartphone, title: "Maintenance & support", benefit: "Un site stable après la mise en ligne", desc: "Petites mises à jour, corrections, conseils et support pour garder votre site professionnel." },
];

export const Services = () => {
  return (
    <section id="services" className="relative section-pad">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">Services</p>
          <h2 className="section-title">
            Nos services
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            MekWeb Agency accompagne les entreprises marocaines avec création de site web, SEO, e-commerce et support après lancement.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-reveal="scale"
              data-reveal-delay={i * 90}
            >
              <div
                className="premium-card motion-card group relative flex h-full flex-col overflow-hidden p-6 lg:p-7"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gold/5" />
                </div>

                <div className="relative">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 ring-1 ring-gold/25 transition-all duration-700 group-hover:bg-gradient-gold group-hover:shadow-gold-soft">
                    <s.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gold transition-colors duration-700 group-hover:text-primary-foreground" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 group-hover:text-gold transition-colors">{s.title}</h3>
                  <p className="text-gold/90 text-base font-semibold leading-relaxed mb-3">{s.benefit}</p>
                  <p className="text-base text-muted-foreground leading-7">{s.desc}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
