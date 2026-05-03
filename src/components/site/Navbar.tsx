import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";
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
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#1d1d1b]/95 py-3 text-white">
      <nav className="container-luxe flex items-center justify-between">
        <a href="#home" className="flex min-w-0 items-center gap-2" aria-label="MekWeb home">
          <BrandLogo markClassName="h-9 w-9 rounded-lg" textClassName="text-xl text-yellow-300 sm:text-2xl" />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-3 py-2 text-sm text-white/85 transition-colors hover:text-yellow-300 lg:px-4"
            >
              {l.label}
              <span className="absolute left-3 right-3 lg:left-4 lg:right-4 -bottom-0.5 h-px bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="hero" size="sm">
            <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer">
              Demander un devis <CalendarCheck />
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
                Demander un devis <CalendarCheck />
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
