import { Code2, Palette, Search, ShoppingBag, RefreshCw, Smartphone } from "lucide-react";

const services = [
  { icon: Code2, title: "Website Development", benefit: "Fast, modern websites that convert visitors into clients", desc: "Lightning-fast, custom-coded websites built with modern frameworks for scale and performance." },
  { icon: Palette, title: "UI / UX Design", benefit: "Beautiful designs that guide visitors straight to action", desc: "Pixel-perfect interfaces designed to delight users and drive measurable conversions." },
  { icon: Search, title: "SEO Optimization", benefit: "Get found on Google and bring in steady free traffic", desc: "Rank higher on Google with technical SEO, content strategy, and Core Web Vitals tuning." },
  { icon: ShoppingBag, title: "E-commerce Development", benefit: "Sell more online with smooth, trust-building checkouts", desc: "Conversion-focused online stores with seamless checkout and inventory management." },
  { icon: RefreshCw, title: "Website Redesign", benefit: "Refresh your old site into a polished lead system", desc: "Transform outdated websites into modern, mobile-first experiences that win clients." },
  { icon: Smartphone, title: "Mobile-First Design", benefit: "Capture the 70% of customers browsing on their phones", desc: "Responsive designs engineered for flawless experiences on every screen size." },
];

export const Services = () => {
  return (
    <section id="services" className="relative section-pad">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">What We Do</p>
          <h2 className="section-title">
            Services built for premium digital growth
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Strategy, design, development, and launch support shaped around one goal: helping visitors become clients.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-reveal="scale"
              data-reveal-delay={i * 90}
            >
              <div
                className="premium-card motion-card group relative flex h-full flex-col overflow-hidden p-6 lg:p-7"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gold/5" />
                </div>

                <div className="relative">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 ring-1 ring-gold/25 transition-all duration-700 group-hover:bg-gradient-gold group-hover:shadow-gold-soft">
                    <s.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gold transition-colors duration-700 group-hover:text-primary-foreground" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 group-hover:text-gold transition-colors">{s.title}</h3>
                  <p className="text-gold/90 text-base font-semibold leading-relaxed mb-3">{s.benefit}</p>
                  <p className="text-base text-muted-foreground leading-7">{s.desc}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
