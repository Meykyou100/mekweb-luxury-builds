import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import a1 from "@/assets/avatar-1.jpg";
import a2 from "@/assets/avatar-2.jpg";
import a3 from "@/assets/avatar-3.jpg";

const reviews = [
  {
    name: "Sarah Chen",
    role: "Founder, Saffron Bistro",
    avatar: a1,
    quote:
      "MekWeb didn't just build us a website — they built a revenue engine. Reservations doubled in the first month and the design feels truly premium.",
  },
  {
    name: "Marcus Bennett",
    role: "CEO, Pulse Analytics",
    avatar: a2,
    quote:
      "The team's attention to detail is unmatched. Our SaaS dashboard is fast, beautiful, and our enterprise clients constantly compliment the UX.",
  },
  {
    name: "Daniel Reyes",
    role: "Owner, CoolFix Pro",
    avatar: a3,
    quote:
      "I run a local AC repair business and never imagined I'd have a site this polished. Calls tripled and we're now booked weeks in advance.",
  },
];

export const Testimonials = () => {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % reviews.length);
  const prev = () => setI((p) => (p - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const r = reviews[i];

  return (
    <section id="testimonials" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-luxe">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16" data-reveal="scale">
          <p className="text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gold mb-4">Client Love</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            What clients <span className="text-gradient-gold italic">say</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto" data-reveal="scale" data-reveal-delay="140">
          <div className="absolute -inset-x-10 -inset-y-6 bg-gold/5 blur-3xl rounded-full -z-10" />

          <div key={i} className="motion-card relative p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-3xl bg-card-gradient border border-gold/20 shadow-elegant animate-fade-in">
            <div className="flex gap-1 mb-5 sm:mb-6 justify-center">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold animate-scale-in" style={{ animationDelay: `${k * 0.08}s` }} />
              ))}
            </div>

            <p className="font-display text-xl sm:text-2xl md:text-3xl leading-snug text-center mb-8 sm:mb-10 italic text-foreground/95">
              "{r.quote}"
            </p>

            <div className="flex flex-col min-[420px]:flex-row items-center justify-center gap-3 sm:gap-4 text-center min-[420px]:text-left">
              <img
                src={r.avatar}
                alt={r.name}
                width={64}
                height={64}
                loading="lazy"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gold/40"
              />
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-gold/30 grid place-items-center hover:bg-gold/10 hover:border-gold transition"
            >
              <ChevronLeft className="w-5 h-5 text-gold" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Go to ${k + 1}`}
                  className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gradient-gold" : "w-1.5 bg-muted-foreground/40"}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-gold/30 grid place-items-center hover:bg-gold/10 hover:border-gold transition"
            >
              <ChevronRight className="w-5 h-5 text-gold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
