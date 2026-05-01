import { ArrowRight, Sparkles, Rocket, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const trustLogos = ["LOGO", "BRAND", "STUDIO", "AGENCY", "CO."];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
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
      <div className="absolute top-1/4 -left-28 w-56 h-56 rounded-full bg-gold/20 blur-3xl animate-float sm:-left-20 sm:w-72 sm:h-72" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-float sm:-right-20 sm:w-96 sm:h-96" style={{ animationDelay: "2s" }} />

      <div className="container-luxe relative">
        <div className="w-full max-w-4xl mx-auto overflow-hidden text-center">
          <div className="inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 overflow-hidden px-3 py-2 sm:px-4 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-sm mb-6 sm:mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="truncate text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] text-gold/90">Premium Web Agency</span>
          </div>

          <h1 className="mx-auto max-w-[11ch] sm:max-w-[13ch] md:max-w-none font-display text-[clamp(2.25rem,10vw,4rem)] md:text-7xl lg:text-8xl font-bold leading-[1.04] mb-5 sm:mb-6 animate-fade-in-up [text-wrap:balance]">
            Turn Your Website Into a{" "}
            <span className="text-gradient-gold italic">Client Machine</span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
            We help restaurants and local businesses get more clients with modern,
            high-converting websites.
          </p>

          <div className="mx-auto flex w-full max-w-sm flex-col gap-4 sm:max-w-none sm:flex-row justify-center animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <Button asChild variant="hero" size="xl" className="h-auto min-h-14 w-full max-w-full flex-wrap whitespace-normal px-5 py-4 text-center text-sm sm:w-auto sm:px-10 sm:text-base animate-glow-pulse">
              <a href="#contact">
                Get Your Free Website Preview <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="xl" className="h-auto min-h-14 w-full max-w-full px-5 py-4 text-sm sm:w-auto sm:px-10 sm:text-base">
              <a href="#portfolio">View Our Work</a>
            </Button>
          </div>

          <div className="mt-14 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s", opacity: 0 }}>
            {[
              { v: "50+", l: "Projects Delivered", icon: Rocket },
              { v: "100%", l: "Client Satisfaction", icon: Heart },
              { v: "5★", l: "Average Rating", icon: Star },
            ].map((s, i) => (
              <div key={s.l} className="motion-card flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl border border-gold/15 bg-card/30 backdrop-blur-sm hover:-translate-y-2 hover:border-gold/40 hover:shadow-gold-soft transition-all duration-500">
                <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold/10 grid place-items-center animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                </span>
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold">{s.v}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Future client logos placeholder */}
          <div className="mt-10 sm:mt-12 animate-fade-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
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
