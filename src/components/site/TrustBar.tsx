import { Clock, LayoutDashboard, MessageCircle, SearchCheck, Smartphone } from "lucide-react";

const items = [
  { icon: Smartphone, title: "Mobile-first", desc: "Built for phone, tablet, and desktop." },
  { icon: SearchCheck, title: "SEO-ready", desc: "Clean structure for Google visibility." },
  { icon: Clock, title: "Fast delivery", desc: "Clear timelines from start to launch." },
  { icon: MessageCircle, title: "WhatsApp integration", desc: "Direct contact paths for more leads." },
  { icon: LayoutDashboard, title: "Admin dashboard", desc: "Available for content control." },
];

export const TrustBar = () => {
  return (
    <section className="relative -mt-7 pb-14 sm:pb-16 lg:pb-20">
      <div className="container-luxe">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              data-reveal="scale"
              data-reveal-delay={i * 70}
              className="premium-card motion-card p-5"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gold/10 ring-1 ring-gold/20">
                <item.icon className="h-5 w-5 text-gold" />
              </span>
              <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-base leading-7 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
