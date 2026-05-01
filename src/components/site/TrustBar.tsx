import { Clock, LifeBuoy, SearchCheck, ShieldCheck, Smartphone } from "lucide-react";

const items = [
  { icon: Smartphone, title: "Mobile-first", desc: "Built for phone, tablet, and desktop." },
  { icon: SearchCheck, title: "SEO-ready", desc: "Clean structure for Google visibility." },
  { icon: Clock, title: "Fast delivery", desc: "Clear timelines from start to launch." },
  { icon: ShieldCheck, title: "Secure setup", desc: "Modern stack and clean launch basics." },
  { icon: LifeBuoy, title: "After-launch help", desc: "Support for fixes and small updates." },
];

export const TrustBar = () => {
  return (
    <section className="relative -mt-8 pb-20 sm:pb-24 lg:pb-32">
      <div className="container-luxe">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              data-reveal="scale"
              data-reveal-delay={i * 70}
              className="motion-card rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold-soft"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gold/10">
                <item.icon className="h-5 w-5 text-gold" />
              </span>
              <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
