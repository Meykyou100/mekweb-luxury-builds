import { ArrowUpRight } from "lucide-react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: p1, title: "Saffron Bistro", category: "Restaurant", result: "+240% more bookings", desc: "Elegant booking platform that lifted reservations by 240% in 3 months." },
  { img: p2, title: "Lumière Studio", category: "E-commerce", result: "5× conversion rate", desc: "Luxury fashion store with immersive product storytelling and 5x conversion." },
  { img: p3, title: "Pulse Analytics", category: "SaaS Platform", result: "+180% signups", desc: "Real-time analytics dashboard built for enterprise teams scaling fast." },
  { img: p4, title: "CoolFix Pro", category: "Service Business", result: "+30% more service calls", desc: "Local AC repair brand reborn — now booking 3x more service calls weekly." },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-20 sm:py-24 lg:py-32 bg-secondary/30">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl" data-reveal="left">
            <p className="text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gold mb-4">Selected Work</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Projects we're <span className="text-gradient-gold italic">proud</span> of
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md" data-reveal="right" data-reveal-delay="140">
            From boutique restaurants to scaling SaaS — every project is engineered to convert.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <div
              key={p.title}
              data-reveal="scale"
              data-reveal-delay={i * 120}
            >
              <article className="motion-card group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-border/60 hover:-translate-y-2 hover:border-gold/40 hover:shadow-gold-soft transition-all duration-500">
                <div className="aspect-[3/4] sm:aspect-[4/3] overflow-hidden relative">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-500" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 transition-transform duration-500">
                  <div className="flex items-end justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-gold mb-2">{p.category}</p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 leading-tight">{p.title}</h3>
                      <p className="inline-block text-xs sm:text-sm font-semibold text-gold px-3 py-1 rounded-full border border-gold/30 bg-gold/10">
                        {p.result}
                      </p>
                      <p className="text-sm text-muted-foreground mt-3 max-h-32 overflow-hidden transition-all duration-500 opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100">
                        {p.desc}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-gold grid place-items-center shrink-0 shadow-gold-soft group-hover:rotate-45 transition-transform duration-500">
                      <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
