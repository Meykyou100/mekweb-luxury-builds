import { Facebook, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
const groups = [
  {
    title: "Expertises",
    links: [
      { label: "Site vitrine", href: "#services" },
      { label: "Site e-commerce", href: "#services" },
      { label: "Refonte", href: "#services" },
      { label: "SEO", href: "#about" },
      { label: "Maintenance & support", href: "#services" },
    ],
  },
  {
    title: "Le studio",
    links: [
      { label: "Réalisations", href: "#portfolio" },
      { label: "Pourquoi MekWeb", href: "#about" },
      { label: "Notre méthode", href: "#how-it-works" },
      { label: "Tarifs", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];
export const Footer = () => (
  <footer className="studio-footer">
    <div className="container-luxe">
      <div className="footer-top">
        <div className="footer-intro">
          <a href="#home" aria-label="MekWeb — Accueil">
            <BrandLogo />
          </a>
          <p>
            MekWeb Agency Maroc crée des sites web professionnels, e-commerce et
            SEO pour les entreprises à Rabat et partout au Maroc.
          </p>
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/mekweb.agency/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MekWeb sur Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61589344164240&sk=about"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MekWeb sur Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="mailto:mekwebagency@gmail.com"
              aria-label="Envoyer un email à MekWeb"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="footer-contact">
          <h3>Restons en contact</h3>
          <ul>
            <li>
              <a href="mailto:mekwebagency@gmail.com">mekwebagency@gmail.com</a>
            </li>
            <li>
              <a href="tel:+212708465603">+212 708-465603</a>
            </li>
            <li>
              <a href="tel:+212762971653">+212 762-971653</a>
            </li>
            <li>Rabat, Maroc</li>
            <li>
              <a
                href="https://wa.me/212708465603"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp <ArrowUpRight size={13} className="ml-2" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MekWeb. Tous droits réservés.</p>
        <p>Pensé avec soin. Créé au Maroc.</p>
        <a href="#home" className="inline-flex items-center gap-2">
          Retour en haut <ArrowUpRight size={12} />
        </a>
      </div>
    </div>
  </footer>
);
