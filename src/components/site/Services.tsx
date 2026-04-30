import { Code2, Palette, Search, ShoppingBag, RefreshCw, Smartphone } from "lucide-react";

const services = [
  { icon: Code2, title: "Website Development", benefit: "Fast, modern websites that convert visitors into clients", desc: "Lightning-fast, custom-coded websites built with modern frameworks for scale and performance." },
  { icon: Palette, title: "UI / UX Design", benefit: "Beautiful designs that guide visitors straight to action", desc: "Pixel-perfect interfaces designed to delight users and drive measurable conversions." },
  { icon: Search, title: "SEO Optimization", benefit: "Get found on Google and bring in steady free traffic", desc: "Rank higher on Google with technical SEO, content strategy, and Core Web Vitals tuning." },
  { icon: ShoppingBag, title: "E-commerce Development", benefit: "Sell more online with smooth, trust-building checkouts", desc: "Conversion-focused online stores with seamless checkout and inventory management." },
  { icon: RefreshCw, title: "Website Redesign", benefit: "Refresh your old site into a client-winning machine", desc: "Transform outdated websites into modern, mobile-first experiences that win clients." },
  { icon: Smartphone, title: "Mobile-First Design", benefit: "Capture the 70% of customers browsing on their phones", desc: "Responsive designs engineered for flawless experiences on every screen size." },
];

export const Services = () => {
  return (
    <section id="services" className="relative py-32">
      <div className="container-luxe">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">What We Do</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Services crafted to <span className="text-gradient-gold italic">elevate</span> your brand
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative p-8 rounded-3xl bg-card-gradient border border-border/60 hover:border-gold/50 transition-all duration-500 overflow-hidden hover:-translate-y-2"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gold/10 blur-3xl" />
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold grid place-items-center mb-6 shadow-gold-soft group-hover:scale-110 transition-transform duration-500">
                  <s.icon className="w-7 h-7 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-gold transition-colors">{s.title}</h3>
                <p className="text-gold/90 text-sm font-medium mb-3">{s.benefit}</p>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
