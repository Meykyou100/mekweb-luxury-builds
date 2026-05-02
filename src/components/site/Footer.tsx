import { Github, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Twitter } from "lucide-react";

const whatsappNumber = "212600000000";
const displayPhone = "+212 600 000 000";
const contactEmail = "contact@mekweb.ma";

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
    <footer className="relative border-t border-gold/10 pt-12 sm:pt-16 pb-8 sm:pb-10">
      <div className="container-luxe">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 mb-12 sm:mb-16">
          <div className="lg:col-span-2" data-reveal="left">
            <a href="#home" className="mb-5 inline-flex items-center gap-2 transition-transform duration-500 hover:scale-[1.02]" aria-label="MekWeb home">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-gold/25 bg-gradient-gold font-display text-xl font-bold text-primary-foreground shadow-gold-soft">M</span>
              <span className="font-display text-3xl font-bold leading-none text-foreground">Mek<span className="text-gold">Web</span></span>
            </a>
            <p className="max-w-sm text-base leading-7 text-muted-foreground mb-6">
              Premium web development for ambitious businesses that want a website built to earn trust and generate leads.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="motion-card grid h-10 w-10 place-items-center rounded-full border border-border/60 transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold/5 hover:text-gold">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
              <li className="flex gap-2"><Mail className="mt-1 h-4 w-4 shrink-0 text-gold" /> {contactEmail}</li>
              <li className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" /> Morocco / Remote</li>
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
