import { ArrowRight, Sparkles, Rocket, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const trustLogos = ["LOGO", "BRAND", "STUDIO", "AGENCY", "CO."];

export const Hero = () => {
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-80 animate-hero-camera"
        />
        <div className="hero-cinematic" aria-hidden="true">
          <span className="hero-light hero-light-1" />
          <span className="hero-light hero-light-2" />
          <span className="hero-light hero-light-3" />
          <span className="hero-scanline" />
        </div>
        <div className="hero-motion-scene" aria-hidden="true">
          <span className="hero-orbit-ring hero-orbit-ring-1" />
          <span className="hero-orbit-ring hero-orbit-ring-2" />
          <span className="hero-web-card hero-web-card-1">
            <span />
            <span />
            <span />
          </span>
          <span className="hero-web-card hero-web-card-2">
            <span />
            <span />
            <span />
          </span>
          <span className="hero-web-card hero-web-card-3">
            <span />
            <span />
            <span />
          </span>
          <span className="hero-node hero-node-1" />
          <span className="hero-node hero-node-2" />
          <span className="hero-node hero-node-3" />
          <span className="hero-node hero-node-4" />
          <span className="hero-data-line hero-data-line-1" />
          <span className="hero-data-line hero-data-line-2" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(0_0%_0%/0.38),hsl(0_0%_0%/0.78)_52%,hsl(0_0%_0%/0.94)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-background/45 to-background" />
      </div>

      <div className="hero-beam top-[18%] left-4 right-4 w-auto sm:left-10 sm:right-10" aria-hidden="true" />
      <div className="hero-beam bottom-[24%] left-4 right-4 w-auto rotate-180 sm:left-10 sm:right-10" style={{ animationDelay: "3.5s" }} aria-hidden="true" />

      <div className="container-luxe relative z-10">
        <div className="mx-auto w-full max-w-5xl overflow-hidden text-center">
          <div className="mb-6 inline-flex max-w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-gold/35 bg-background/55 px-3 py-2 shadow-elegant backdrop-blur-md animate-fade-in sm:px-4">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="truncate text-[10px] uppercase tracking-[0.14em] text-gold/90 sm:text-xs sm:tracking-[0.2em]">Premium Web Agency</span>
          </div>

          <h1 className="mx-auto mb-6 max-w-[12ch] font-display text-[clamp(3rem,7.6vw,6.5rem)] font-bold leading-[1.02] text-white drop-shadow-[0_18px_45px_hsl(0_0%_0%/0.55)] animate-fade-in-up [text-wrap:balance] sm:max-w-[13ch]">
            Premium websites that{" "}
            <span className="inline-block text-gradient-gold italic">win clients</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-white/88 animate-fade-in-up sm:text-xl md:text-2xl md:leading-9" style={{ animationDelay: "0.15s", opacity: 0 }}>
            MekWeb builds fast, elegant websites for restaurants and local businesses that need more calls, bookings, and qualified leads.
          </p>

          <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-3 animate-fade-in-up sm:max-w-none sm:flex-row" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <Button asChild variant="hero" size="xl" className="h-auto min-h-14 w-full max-w-full flex-wrap whitespace-normal px-6 py-4 text-center text-base font-bold animate-glow-pulse sm:w-auto sm:px-9 sm:text-base">
              <a href="#contact">
                Get Your Free Website Preview <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="xl" className="h-auto min-h-14 w-full max-w-full border-white/35 bg-black/25 px-6 py-4 text-base font-bold text-white backdrop-blur-md hover:bg-black/35 sm:w-auto sm:px-9">
              <a href="#portfolio">View Our Work</a>
            </Button>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 animate-fade-in sm:grid-cols-3" style={{ animationDelay: "0.5s", opacity: 0 }}>
            {[
              { v: "50+", l: "Projects Delivered", icon: Rocket },
              { v: "100%", l: "Client Satisfaction", icon: Heart },
              { v: "5/5", l: "Average Rating", icon: Star },
            ].map((s, i) => (
              <div key={s.l} className="motion-card flex min-h-[128px] flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-background/50 p-5 shadow-elegant backdrop-blur-md transition-all duration-700 hover:-translate-y-1 hover:border-gold/45 hover:shadow-gold-soft">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/20 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <s.icon className="h-4 w-4 text-gold sm:h-5 sm:w-5" />
                </span>
                <div className="font-number text-2xl font-bold text-gradient-gold sm:text-3xl md:text-4xl">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-black/70 dark:text-white/70 sm:text-xs sm:tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-9 animate-fade-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-black/55 dark:text-white/45">Trusted by ambitious brands</p>
            <div className="relative mx-auto max-w-3xl overflow-hidden opacity-50 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max items-center gap-x-10 animate-marquee">
                {[...trustLogos, ...trustLogos].map((n, i) => (
                  <span key={`${n}-${i}`} className="font-display text-sm tracking-[0.25em] text-black/60 dark:text-white/60">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
