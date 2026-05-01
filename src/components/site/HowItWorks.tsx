import { Search, Pencil, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    n: "01",
    title: "We analyze your business",
    desc: "We learn about your goals, customers, and competitors to craft a strategy that wins clients.",
  },
  {
    icon: Pencil,
    n: "02",
    title: "We design your website",
    desc: "A modern, mobile-first website built around conversion — beautiful, fast, and easy to manage.",
  },
  {
    icon: TrendingUp,
    n: "03",
    title: "You get more clients",
    desc: "Launch and grow. Your new website becomes a 24/7 client machine working while you sleep.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-luxe">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20" data-reveal="scale">
          <p className="text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gold mb-4">The Process</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            How it <span className="text-gradient-gold italic">works</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-5 sm:mt-6">
            A simple, proven 3-step process from first call to launch.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {/* connecting line */}
          <div className="process-line hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {steps.map((s, i) => (
            <div
              key={s.n}
              data-reveal="scale"
              data-reveal-delay={i * 140}
              className="relative text-center group"
            >
              <div className="relative mx-auto mb-6 sm:mb-8 w-20 h-20 sm:w-24 sm:h-24">
                <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-card border border-gold/30 grid place-items-center shadow-gold-soft group-hover:border-gold group-hover:scale-105 transition-all duration-500">
                  <s.icon className="w-8 h-8 sm:w-9 sm:h-9 text-gold" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-gold text-primary-foreground text-xs sm:text-sm font-display font-bold grid place-items-center shadow-gold-soft">
                  {s.n}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 group-hover:text-gold transition-colors">
                {s.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
