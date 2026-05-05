import { Code2, RefreshCw, ShieldCheck, ShoppingBag } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Site vitrine professionnel",
    desc: "Présentez votre entreprise avec un site moderne, rapide et adapté au mobile.",
  },
  {
    icon: ShoppingBag,
    title: "Site e-commerce",
    desc: "Vendez vos produits en ligne avec une boutique claire, professionnelle et facile à gérer.",
  },
  {
    icon: RefreshCw,
    title: "Refonte de site web",
    desc: "Modernisez votre ancien site avec un design plus premium et plus efficace.",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & support",
    desc: "Gardez votre site rapide, sécurisé et toujours à jour.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="relative section-pad">
      <div className="container-luxe">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">Services</p>
          <h2 className="section-title">Nos services</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Des solutions simples et professionnelles pour aider les entreprises marocaines à attirer plus de clients en ligne.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              data-reveal="scale"
              data-reveal-delay={index * 100}
              className="premium-card motion-card group flex h-full flex-col p-6 sm:p-7"
            >
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gold/12 ring-1 ring-gold/30 transition-colors duration-300 group-hover:bg-gradient-gold">
                <service.icon className="h-7 w-7 text-gold transition-colors duration-300 group-hover:text-black" strokeWidth={1.8} />
              </div>
              <h3 className="mb-3 font-display text-2xl font-bold leading-tight text-foreground">
                {service.title}
              </h3>
              <p className="text-base leading-7 text-muted-foreground">
                {service.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
