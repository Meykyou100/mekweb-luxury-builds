import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import logo from "@/assets/mekweb-logo.png";

const groups = [
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "#services" },
      { label: "UI/UX Design", href: "#services" },
      { label: "SEO", href: "#services" },
      { label: "E-commerce", href: "#services" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Free Website Preview", href: "#contact" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-gold/10 pt-14 sm:pt-20 pb-8 sm:pb-10">
      <div className="container-luxe">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-9 sm:gap-12 mb-12 sm:mb-16">
          <div className="lg:col-span-2" data-reveal="left">
            <a href="#home" className="inline-flex items-center mb-5 transition-transform duration-300 hover:scale-[1.03]" aria-label="MekWeb home">
              <img
                src={logo}
                alt="MekWeb"
                className="h-28 w-auto max-w-[210px] object-contain sm:h-32 sm:max-w-[250px]"
              />
            </a>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mb-6">
              Building digital experiences that convert. Premium web development for ambitious brands.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="motion-card w-10 h-10 rounded-full border border-border/60 grid place-items-center hover:-translate-y-1 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((g, i) => (
            <div key={g.title} data-reveal="scale" data-reveal-delay={i * 90}>
              <h4 className="font-display text-base font-bold mb-4 text-gold">{g.title}</h4>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="inline-block text-sm text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-gold">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-center md:text-left" data-reveal="scale">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MekWeb. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Crafted with precision. Designed to convert.</p>
        </div>
      </div>
    </footer>
  );
};
