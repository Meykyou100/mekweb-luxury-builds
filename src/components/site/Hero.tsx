import { ArrowRight, Sparkles, Rocket, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const trustLogos = ["LOGO", "BRAND", "STUDIO", "AGENCY", "CO."];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1280}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container-luxe relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Premium Web Agency</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-fade-in-up [text-wrap:balance]">
            Turn Your Website Into a{" "}
            <span className="text-gradient-gold italic">Client Machine</span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
            We help restaurants and local businesses get more clients with modern,
            high-converting websites.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <Button asChild variant="hero" size="xl" className="h-auto min-h-14 w-full max-w-full flex-wrap whitespace-normal px-5 py-4 text-center text-sm sm:w-auto sm:px-10 sm:text-base animate-glow-pulse">
              <a href="#contact">
                Get Your Free Website Preview <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="xl" className="h-auto min-h-14 w-full max-w-full px-5 py-4 text-sm sm:w-auto sm:px-10 sm:text-base">
              <a href="#portfolio">View Our Work</a>
            </Button>
          </div>

          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s", opacity: 0 }}>
            {[
              { v: "50+", l: "Projects Delivered", icon: Rocket },
              { v: "100%", l: "Client Satisfaction", icon: Heart },
              { v: "5★", l: "Average Rating", icon: Star },
            ].map((s, i) => (
              <div key={s.l} className="motion-card flex flex-col items-center gap-3 p-6 rounded-2xl border border-gold/15 bg-card/30 backdrop-blur-sm hover:-translate-y-2 hover:border-gold/40 hover:shadow-gold-soft transition-all duration-500">
                <span className="w-11 h-11 rounded-full bg-gold/10 grid place-items-center animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <s.icon className="w-5 h-5 text-gold" />
                </span>
                <div className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Future client logos placeholder */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 mb-4">Trusted by ambitious brands</p>
            <div className="relative mx-auto max-w-3xl overflow-hidden opacity-50 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max items-center gap-x-10 animate-marquee">
                {[...trustLogos, ...trustLogos].map((n, i) => (
                  <span key={`${n}-${i}`} className="font-display text-sm tracking-[0.25em] text-muted-foreground">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
