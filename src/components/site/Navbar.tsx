import { useEffect, useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { BrandLogo } from "@/components/site/BrandLogo";

const links = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const whatsappNumber = "212708465603";
const callMessage = encodeURIComponent("Bonjour, je veux book a free call pour parler de mon site web.");

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-2 bg-background/80 backdrop-blur-xl border-b border-gold/10" : "py-3 bg-[#1d1d1b]/80 text-white backdrop-blur-md border-b border-white/10",
      )}
    >
      <nav className="container-luxe flex items-center justify-between">
        <a href="#home" className="flex min-w-0 items-center gap-2 transition-transform duration-500 hover:scale-[1.02]" aria-label="MekWeb home">
          <BrandLogo markClassName="h-9 w-9 rounded-lg" textClassName={cn("text-xl sm:text-2xl", scrolled ? "text-gold" : "text-yellow-300")} />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 lg:px-4 py-2 text-sm transition-colors relative group",
                scrolled ? "text-muted-foreground hover:text-gold" : "text-white/85 hover:text-yellow-300",
              )}
            >
              {l.label}
              <span className="absolute left-3 right-3 lg:left-4 lg:right-4 -bottom-0.5 h-px bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="hero" size="sm" className="animate-glow-pulse hover:animate-none">
            <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer">
              Book a Free Call <CalendarCheck />
            </a>
          </Button>
        </div>

        <button
          className={cn("p-2 md:hidden", scrolled ? "text-foreground" : "text-white")}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden container-luxe mt-3 sm:mt-4 pb-4 animate-fade-in">
          <div className="flex max-h-[calc(100svh-6rem)] flex-col gap-1 overflow-y-auto bg-card/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-gold/10">
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
            <Button asChild variant="hero" className="mt-2 animate-glow-pulse">
              <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                Book a Free Call <CalendarCheck />
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
