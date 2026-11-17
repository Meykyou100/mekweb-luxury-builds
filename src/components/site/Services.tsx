import {
  ArrowUpRight,
  Code2,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
const services = [
  {
    icon: Code2,
    title: "Site vitrine professionnel",
    desc: "Présentez votre entreprise avec un site moderne, rapide et adapté au mobile.",
    detail: "Une présence qui inspire confiance",
  },
  {
    icon: ShoppingBag,
    title: "Site e-commerce",
    desc: "Vendez vos produits en ligne avec une boutique claire, professionnelle et facile à gérer.",
    detail: "Une boutique pensée pour vos clients",
  },
  {
    icon: RefreshCw,
    title: "Refonte de site web",
    desc: "Modernisez votre ancien site avec un design plus premium et plus efficace.",
    detail: "Un nouveau regard sur votre marque",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & support",
    desc: "Gardez votre site rapide, sécurisé et toujours à jour.",
    detail: "Un partenaire dans la durée",
  },
];
export const Services = () => (
  <section id="services" className="section-pad">
    <div className="container-luxe">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">01 / Nos expertises</p>
          <h2 className="section-title">
            Le fond. La forme.
            <br />
            <em>Et tout ce qui compte.</em>
          </h2>
        </div>
        <p className="section-copy">
          Des solutions simples et professionnelles pour aider les entreprises
          marocaines à attirer plus de clients en ligne.
        </p>
      </div>
      <div className="services-bento">
        {services.map((service, index) => (
          <article
            key={service.title}
            className={`service-card service-card-${index}`}
            data-reveal
            data-reveal-delay={index * 60}
          >
            <div className="service-top">
              <service.icon size={27} strokeWidth={1.3} />
              <span>0{index + 1}</span>
            </div>
            <div className="service-art" aria-hidden="true">
              {index === 0 ? (
                <>
                  <div className="mini-web">
                    <span />
                    <i />
                    <b />
                    <b />
                    <div>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className="mini-mobile">
                    <span />
                    <i />
                    <b />
                    <b />
                  </div>
                </>
              ) : index === 1 ? (
                <>
                  <div className="shop-outline">
                    <ShoppingBag size={48} strokeWidth={0.7} />
                    <span>Une expérience fluide.</span>
                  </div>
                </>
              ) : null}
            </div>
            <div>
              <p className="card-kicker">{service.detail}</p>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
            <a
              href="#contact"
              className="service-link"
              aria-label={`Discuter de votre projet : ${service.title}`}
            >
              <ArrowUpRight size={19} />
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);
