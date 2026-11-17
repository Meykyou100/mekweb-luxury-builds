import { ArrowUpRight } from "lucide-react";
import parapharmacie from "@/assets/portfolio/parapharmacie-concept.webp";
import traiteur from "@/assets/portfolio/traiteur-concept.webp";
import nettoyage from "@/assets/portfolio/nettoyage-concept.webp";
import climatisation from "@/assets/portfolio/climatisation-concept.webp";
import securite from "@/assets/portfolio/securite-concept.webp";
import riad from "@/assets/portfolio/riad-concept.webp";

const projects = [
  {
    img: parapharmacie,
    alt: "Boutique de parapharmacie : soins du visage, hydratation et bien-être dans une palette sauge et ivoire.",
    title: "Parapharmacie",
    category: "E-commerce",
    desc: "Boutique en ligne claire pour présenter les produits, catégories et demandes client.",
  },
  {
    img: traiteur,
    alt: "Site de traiteur : table de réception marocaine, menus et événements dans des tons aubergine et cuivre.",
    title: "Traiteur",
    category: "Site vitrine",
    desc: "Site élégant pour menus, événements, galerie, devis et contact WhatsApp.",
  },
  {
    img: nettoyage,
    alt: "Site de nettoyage : entretien de bureaux et de résidences, avec une identité blanche et bleu canard.",
    title: "Agence de nettoyage",
    category: "Service local",
    desc: "Présentation fiable des services, zones d'intervention et formulaire de contact.",
  },
  {
    img: climatisation,
    alt: "Site de climatisation : installation, entretien et dépannage dans une identité claire et bleu nuit.",
    title: "Climatisation / frigoriste",
    category: "Service technique",
    desc: "Site rapide pour interventions, maintenance, urgences et appels directs.",
  },
  {
    img: securite,
    alt: "Site de sécurité et gardiennage : accueil professionnel, contrôle d’accès et surveillance.",
    title: "Sécurité / gardiennage",
    category: "Entreprise B2B",
    desc: "Image sérieuse pour prestations, équipes, références et demandes de devis.",
  },
  {
    img: riad,
    alt: "Site de restaurant et riad : cour marocaine, cuisine et hospitalité dans des tons terracotta.",
    title: "Restaurant / riad",
    category: "Hospitalité",
    desc: "Site premium pour présenter l'expérience, les photos, réservations et accès.",
  },
];

export const Portfolio = () => (
  <section id="portfolio" className="section-pad portfolio-section">
    <div className="container-luxe">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">02 / Sélection de créations</p>
          <h2 className="section-title">
            Des univers singuliers.
            <br />
            <em>Une même exigence.</em>
          </h2>
        </div>
        <div>
          <p className="section-copy">
            Des concepts visuels de sites adaptés aux métiers locaux au Maroc :
            commerce, services, restauration, sécurité et entreprises
            spécialisées.
          </p>
          <a className="text-link mt-6" href="#contact">
            Imaginons le vôtre <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <article
            key={project.title}
            className="portfolio-project"
            data-reveal
          >
            <a
              href="#contact"
              className="portfolio-image-link"
              aria-label={`Discuter d’un projet de type ${project.title}`}
            >
              <div className="portfolio-image">
                <img
                  src={project.img}
                  alt={`Concept visuel — ${project.alt}`}
                  loading="lazy"
                  decoding="async"
                  width={1448}
                  height={1086}
                />
              </div>
            </a>
            <div className="portfolio-caption">
              <div>
                <p className="card-kicker">
                  0{index + 1} / {project.category} · Concept visuel
                </p>
                <h3>{project.title}</h3>
              </div>
              <span className="project-medium">Direction artistique</span>
            </div>
            <p className="portfolio-description">{project.desc}</p>
            <a href="#contact" className="text-link project-contact">
              Discuter d’un projet similaire <ArrowUpRight size={15} />
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);
