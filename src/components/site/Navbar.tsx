import { useState } from "react";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { BrandLogo } from "@/components/site/BrandLogo";

const links = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#portfolio", label: "Réalisations" },
  { href: "#about", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

const whatsappNumber = "212708465603";
const callMessage = encodeURIComponent("Bonjour MekWeb, je veux demander un devis pour la création de mon site web.");

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black py-2 text-white">
      <nav className="container-luxe flex items-center justify-between">
        <a href="#home" className="flex min-w-0 items-center gap-2" aria-label="MekWeb home">
          <BrandLogo markClassName="h-8 w-8 border-0 bg-transparent sm:h-10 sm:w-10" textClassName="text-lg sm:text-xl" />
        </a>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative px-2 py-2 text-sm font-semibold text-white transition-colors hover:text-yellow-300"
            >
              {l.label}
              <span className="absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-gold transition-transform group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outlineGold" size="sm" className="border-yellow-300/70 bg-black/15 px-4 py-3 text-yellow-300 hover:bg-yellow-300 hover:text-black">
            <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer">
              <BriefcaseBusiness className="h-4 w-4" /> Demander un devis
            </a>
          </Button>
        </div>

        <button className="p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden container-luxe mt-3 sm:mt-4 pb-4 animate-fade-in">
          <div className="flex max-h-[calc(100svh-6rem)] flex-col gap-1 overflow-y-auto bg-card rounded-2xl p-3 sm:p-4 border border-gold/10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-gold hover:bg-gold/5"
              >
                {l.label}
              </a>
            ))}
            <Button asChild variant="hero" className="mt-2">
              <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                Demander un devis <BriefcaseBusiness />
              </a>
            </Button>
            <div className="mt-2 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
