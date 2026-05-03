import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";

const whatsappNumber = "212708465603";
const displayPhone = "+212 708-465603";
const secondPhone = "+212 762-971653";
const contactEmail = "mekwebagency@gmail.com";
const instagramUrl = "https://www.instagram.com/mekweb.agency/";
const facebookUrl = "https://www.facebook.com/profile.php?id=61589344164240&sk=about";

const footerGroups = [
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "#services" },
      { label: "UI/UX Design", href: "#services" },
      { label: "SEO Optimization", href: "#services" },
      { label: "E-commerce", href: "#services" },
    ],
  },
  {
    title: "Quick links",
    links: [
      { label: "Pricing", href: "#pricing" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-gold/10 py-10 sm:py-12">
      <div className="container-luxe">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 mb-12 sm:mb-16">
          <div className="lg:col-span-2" data-reveal="left">
            <a href="#home" className="mb-5 inline-flex items-center gap-2 transition-transform duration-500 hover:scale-[1.02]" aria-label="MekWeb home">
              <BrandLogo markClassName="h-12 w-12" textClassName="text-3xl" />
            </a>
            <p className="max-w-sm text-base leading-7 text-muted-foreground mb-6">
              Premium web development for ambitious businesses that want a website built to earn trust and generate leads.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="motion-card inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold/5 hover:text-gold">
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="motion-card inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold/5 hover:text-gold">
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
              <a href={`mailto:${contactEmail}`} className="motion-card inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold/5 hover:text-gold">
                <Mail className="h-4 w-4" />
                Gmail
              </a>
            </div>
          </div>

          {footerGroups.map((g, i) => (
            <div key={g.title} data-reveal="scale" data-reveal-delay={i * 90}>
              <h4 className="font-display text-lg font-bold mb-4 text-gold">{g.title}</h4>
              <ul className="space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="inline-block text-base text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-gold">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal="scale" data-reveal-delay={180}>
            <h4 className="font-display text-lg font-bold mb-4 text-gold">Contact</h4>
            <ul className="space-y-3 text-base text-muted-foreground">
              <li className="flex gap-2"><Phone className="mt-1 h-4 w-4 shrink-0 text-gold" /> {displayPhone}</li>
              <li className="flex gap-2"><Phone className="mt-1 h-4 w-4 shrink-0 text-gold" /> {secondPhone}</li>
              <li className="flex gap-2"><Mail className="mt-1 h-4 w-4 shrink-0 text-gold" /> <a href={`mailto:${contactEmail}`} className="hover:text-gold">{contactEmail}</a></li>
              <li className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" /> Morocco - Rabat</li>
              <li>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold hover:underline">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-center md:flex-row md:text-left" data-reveal="scale">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MekWeb. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Crafted with precision. Designed to convert.</p>
        </div>
      </div>
    </footer>
  );
};
