import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";

const links = [
  { href: "#services", label: "Expertises" },
  { href: "#portfolio", label: "Réalisations" },
  { href: "#about", label: "Le studio" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const sections = links
        .map((link) => document.querySelector(link.href))
        .filter(Boolean);
      const current = [...sections]
        .reverse()
        .find((section) => section!.getBoundingClientRect().top <= 180);
      setActive(current ? `#${current.id}` : "");
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new MutationObserver(update);
    const main = document.getElementById("main-content");
    if (main) observer.observe(main, { childList: true, subtree: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const elements = [
          toggle.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="studio-header">
      <nav
        className="container-luxe nav-inner"
        aria-label="Navigation principale"
      >
        <a
          href="#home"
          aria-label="MekWeb — Accueil"
          onClick={() => setOpen(false)}
        >
          <BrandLogo />
        </a>
        <div className="desktop-nav">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <a className="nav-cta" href="#contact">
          Parlons de votre projet <ArrowUpRight size={16} />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div
          ref={panel}
          id="mobile-navigation"
          className="mobile-navigation container-luxe"
        >
          <p className="eyebrow">Explorer MekWeb</p>
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="nav-number">0{index + 1}</span>
              {link.label}
              <ArrowUpRight size={22} />
            </a>
          ))}
          <p>Rabat, Maroc · Design & développement</p>
        </div>
      )}
    </header>
  );
};
