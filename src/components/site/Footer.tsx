import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

const groups = [
  { title: "Services", links: ["Web Development", "UI/UX Design", "SEO", "E-commerce", "Redesign"] },
  { title: "Company", links: ["About", "Portfolio", "Testimonials", "Contact", "Careers"] },
  { title: "Resources", links: ["Blog", "Case Studies", "Pricing", "FAQ", "Support"] },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-gold/10 pt-20 pb-10">
      <div className="container-luxe">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2" data-reveal="left">
            <a href="#home" className="flex items-center gap-2 mb-5">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-gold text-primary-foreground font-display font-black text-lg">M</span>
              <span className="font-display text-xl font-bold">
                Mek<span className="text-gradient-gold">Web</span>
              </span>
            </a>
            <p className="text-muted-foreground max-w-sm mb-6">
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
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-gold transition">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4" data-reveal="scale">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MekWeb. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Crafted with precision. Designed to convert.</p>
        </div>
      </div>
    </footer>
  );
};
