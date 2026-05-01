import { Check } from "lucide-react";

const stats = [
  { v: "50+", l: "Projects Delivered" },
  { v: "100%", l: "Client Satisfaction" },
  { v: "4+", l: "Years Experience" },
  { v: "24/7", l: "Support" },
];

const points = [
  "Conversion-first design philosophy",
  "Modern stack: React, Next.js, Tailwind",
  "SEO baked into every line of code",
  "Dedicated project manager on every build",
];

export const About = () => {
  return (
    <section id="about" className="relative py-32 bg-secondary/30">
      <div className="container-luxe grid lg:grid-cols-2 gap-16 items-center">
        <div data-reveal="left">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">About MekWeb</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            We help businesses <span className="text-gradient-gold italic">grow online</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            MekWeb is a boutique web development agency on a mission to make premium digital
            experiences accessible to ambitious businesses of every size — from neighborhood
            restaurants to fast-scaling SaaS startups.
          </p>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            We obsess over the details: every pixel, every load millisecond, every conversion
            opportunity. The result? Websites that don't just look stunning — they pay for themselves.
          </p>

          <ul className="space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gold/15 grid place-items-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-gold" strokeWidth={3} />
                </span>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {stats.map((s, i) => (
            <div
              key={s.l}
              data-reveal="scale"
              data-reveal-delay={i * 110}
            >
              <div className={`motion-card p-8 rounded-3xl bg-card-gradient border border-border/60 hover:border-gold/40 hover:shadow-gold-soft transition-all duration-500 ${i % 3 === 0 ? "md:translate-y-6" : ""}`}>
                <div className="font-display text-5xl md:text-6xl font-bold text-gradient-gold mb-2">{s.v}</div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
