import { useState } from "react";
import { Menu, X } from "lucide-react";
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
const callMessage = encodeURIComponent(
  "Bonjour MekWeb, je veux demander un devis pour la création de mon site web."
);

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black py-2 text-white">
      <nav className="container-luxe flex items-center justify-between">
        <a
          href="#home"
          className="flex min-w-0 items-center gap-2"
          aria-label="MekWeb home"
        >
          <BrandLogo
            markClassName="h-8 w-8 border-0 bg-transparent sm:h-10 sm:w-10"
            textClassName="text-lg sm:text-xl"
          />
        </a>

        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-2 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:text-yellow-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${callMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-yellow-300/70 bg-black px-4 py-2 text-sm font-bold text-yellow-300 transition-colors duration-150 hover:border-yellow-300 hover:bg-yellow-300 hover:text-black"
          >
            Demander un devis
          </a>
        </div>

        <button
          className="p-2 text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="container-luxe mt-3 pb-4 md:hidden sm:mt-4">
          <div className="flex max-h-[calc(100svh-6rem)] flex-col gap-1 overflow-y-auto rounded-2xl border border-gold/10 bg-card p-3 sm:p-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-gold/5 hover:text-gold"
              >
                {l.label}
              </a>
            ))}

            <a
              href={`https://wa.me/${whatsappNumber}?text=${callMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-black transition-colors duration-150 hover:bg-yellow-400"
            >
              Demander un devis
            </a>

            <div className="mt-2 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};