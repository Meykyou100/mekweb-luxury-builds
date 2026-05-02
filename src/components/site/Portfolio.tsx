import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: p1, title: "Saffron Bistro", category: "Restaurant", result: "+240% bookings", desc: "Elegant booking platform that helped turn mobile visitors into reservations." },
  { img: p2, title: "Lumiere Studio", category: "E-commerce", result: "5x conversion rate", desc: "Luxury fashion store with product storytelling and a smoother buying path." },
  { img: p3, title: "Pulse Analytics", category: "SaaS Platform", result: "+180% signups", desc: "A polished analytics experience designed for scaling teams and demos." },
  { img: p4, title: "CoolFix Pro", category: "Service Business", result: "+30% service calls", desc: "Local repair brand rebuilt around trust, speed, and phone-first contact." },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <div data-reveal="scale">
            <p className="eyebrow mb-4">Selected Work</p>
            <h2 className="section-title">
              Clean websites designed to convert
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              From local service businesses to modern stores, every project balances premium visuals with clear customer action.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {projects.map((p, i) => (
            <div key={p.title} data-reveal="scale" data-reveal-delay={i * 120}>
              <article className="premium-card motion-card group relative overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover brightness-105 saturate-110 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-40 transition-opacity duration-700 group-hover:opacity-90" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-700 sm:p-7">
                  <div className="flex items-end justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gold sm:text-xs sm:tracking-[0.2em]">{p.category}</p>
                      <h3 className="mb-2 font-display text-2xl font-bold leading-tight text-white md:text-3xl">{p.title}</h3>
                      <p className="inline-block rounded-full border border-gold/30 bg-black/30 px-3 py-1 text-xs font-semibold text-gold backdrop-blur-sm sm:text-sm">
                        {p.result}
                      </p>
                      <p className="mt-3 max-h-32 overflow-hidden text-sm text-white/78 opacity-100 transition-all duration-500 md:max-h-0 md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100">
                        {p.desc}
                      </p>
                    </div>
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold shadow-gold-soft transition-transform duration-700 group-hover:rotate-45 sm:h-12 sm:w-12">
                      <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row" data-reveal="scale">
          <Button asChild variant="hero" size="lg" className="h-auto min-h-12 w-full px-6 py-4 sm:w-auto">
            <a href="#contact">Book a similar website <ArrowRight /></a>
          </Button>
          <Button asChild variant="outlineGold" size="lg" className="h-auto min-h-12 w-full px-6 py-4 sm:w-auto">
            <a href="#portfolio">View more projects</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
