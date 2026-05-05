import { ArrowUpRight } from "lucide-react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: p1, title: "Parapharmacie", category: "E-commerce", desc: "Boutique en ligne claire pour présenter les produits, catégories et demandes client." },
  { img: p2, title: "Traiteur", category: "Site vitrine", desc: "Site élégant pour menus, événements, galerie, devis et contact WhatsApp." },
  { img: p3, title: "Agence de nettoyage", category: "Service local", desc: "Présentation fiable des services, zones d'intervention et formulaire de contact." },
  { img: p4, title: "Climatisation / frigoriste", category: "Service technique", desc: "Site rapide pour interventions, maintenance, urgences et appels directs." },
  { img: p1, title: "Sécurité / gardiennage", category: "Entreprise B2B", desc: "Image sérieuse pour prestations, équipes, références et demandes de devis." },
  { img: p2, title: "Restaurant / riad", category: "Hospitalité", desc: "Site premium pour présenter l'expérience, les photos, réservations et accès." },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">Réalisations</p>
          <h2 className="section-title">Nos réalisations</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Des exemples de sites adaptés aux métiers locaux au Maroc : commerce, services, restauration, sécurité et entreprises spécialisées.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              data-reveal="scale"
              data-reveal-delay={index * 90}
              className="premium-card motion-card overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={project.img}
                  alt={`${project.title} - réalisation MekWeb`}
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-gold">
                  {project.category}
                </p>
                <h3 className="mb-3 font-display text-2xl font-bold leading-tight text-foreground">
                  {project.title}
                </h3>
                <p className="mb-5 text-sm leading-6 text-muted-foreground">
                  {project.desc}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-gold hover:text-foreground"
                >
                  Voir le projet <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
