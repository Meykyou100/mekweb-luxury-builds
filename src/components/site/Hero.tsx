import { Activity, ArrowRight, BarChart3, Heart, LayoutDashboard, Mouse, Rocket, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#1d1d1b] pb-20 pt-24 text-white sm:pt-28 lg:pb-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(250,204,21,0.32),transparent_36%),radial-gradient(circle_at_48%_86%,rgba(250,204,21,0.42),transparent_34%),linear-gradient(135deg,#191918_0%,#24231d_48%,#0d0d0c_100%)]" />
        <div className="absolute inset-x-10 top-20 h-px bg-white/30" />
        <div className="hero-orb absolute right-[8%] top-24 h-24 w-24 rounded-full bg-yellow-300/80 blur-sm" />
        <div className="hero-orb absolute right-[5%] bottom-28 h-16 w-16 rounded-full bg-white/60 blur-[2px]" style={{ animationDelay: "1.4s" }} />
        <div className="hero-orb hero-orb-soft absolute left-[9%] bottom-[22%] h-14 w-14 rounded-full bg-yellow-200/50 blur-[3px]" style={{ animationDelay: "2.1s" }} />
        <div className="hero-orb hero-orb-soft absolute left-[54%] top-[17%] h-10 w-10 rounded-full bg-white/45 blur-[2px]" style={{ animationDelay: "3.2s" }} />
        <div className="hero-frame absolute left-0 right-0 top-20 mx-auto h-[52%] max-w-[92rem] rounded-t-[46%] border border-white/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container-luxe relative z-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1fr)] lg:gap-16">
          <div className="max-w-2xl text-left">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-yellow-300/50 bg-black/25 px-4 py-2 shadow-elegant backdrop-blur-md animate-fade-in">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="truncate text-[10px] uppercase tracking-[0.18em] text-yellow-100 sm:text-xs">Premium Web Agency</span>
            </div>

            <h1 className="mb-6 max-w-3xl font-sans text-[clamp(3rem,7.2vw,6.6rem)] font-black uppercase leading-[0.94] tracking-tight text-white animate-fade-in-up [text-wrap:balance]">
              Get <span className="text-yellow-300">your</span> website
            </h1>

            <p className="mb-6 max-w-xl text-base leading-7 text-white/86 animate-fade-in-up sm:text-lg" style={{ animationDelay: "0.15s", opacity: 0 }}>
              We design and develop websites around your ideas. Tell us what you want, and MekWeb will build it with clean code, high quality, and care for every detail.
            </p>

            <div className="mb-8 flex max-w-md overflow-hidden rounded-lg border border-yellow-300/80 bg-black/20 p-1 animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
              <input
                type="email"
                aria-label="Email address"
                placeholder="Enter Email Address"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <a href="#contact" aria-label="Submit email" className="grid w-14 place-items-center rounded-md bg-white/45 text-black transition-colors hover:bg-yellow-300">
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "0.35s", opacity: 0 }}>
              <ArrowRight className="mb-3 h-8 w-8 text-yellow-300" />
              <p className="max-w-lg text-[clamp(1.9rem,4.5vw,3.2rem)] font-black uppercase leading-[1.02] tracking-tight text-yellow-300">
                Change your idea to a business
              </p>
            </div>
          </div>

          <div className="hero-mockup relative mx-auto w-full max-w-2xl animate-float lg:mx-0">
            <div className="absolute -inset-10 rounded-[42px] bg-yellow-300/35 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[34px] border border-yellow-200/35 bg-black/35 p-6 shadow-[0_40px_120px_rgba(250,204,21,0.18)] backdrop-blur-md">
              <div className="hero-orb absolute -left-8 -top-8 h-20 w-20 rounded-full bg-white/70" style={{ animationDelay: "0.6s" }} />
              <div className="hero-orb absolute -bottom-7 left-24 h-12 w-12 rounded-full bg-yellow-300/70" style={{ animationDelay: "1.8s" }} />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#20201d] p-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-yellow-300" />
                    <span className="h-3 w-3 rounded-full bg-white/30" />
                    <span className="h-3 w-3 rounded-full bg-white/20" />
                  </div>
                  <LayoutDashboard className="h-5 w-5 text-yellow-300" />
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
                  <div className="rounded-xl border border-yellow-300/30 bg-black/35 p-4">
                    <div className="mb-4 flex items-end gap-2">
                      {[42, 68, 52, 86, 72, 94, 64].map((h, i) => (
                        <span key={i} className="chart-bar w-full rounded-t bg-yellow-300/85" style={{ height: `${h}px`, animationDelay: `${i * 0.16}s` }} />
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <span key={i} className="h-2 rounded-full bg-white/20" />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-xl border border-yellow-300/30 bg-black/35 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-yellow-200">
                        <Activity className="h-4 w-4" />
                        Leads Growth
                      </div>
                      <div className="flex h-20 items-end gap-2">
                        {[28, 46, 35, 60, 52, 76].map((h, i) => (
                          <span key={i} className="chart-bar w-full rounded-t bg-gradient-to-t from-yellow-600 to-yellow-200" style={{ height: `${h}%`, animationDelay: `${i * 0.18}s` }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-yellow-300/30 bg-black/35 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-yellow-200">
                        <BarChart3 className="h-4 w-4" />
                        Website Performance
                      </div>
                      <div className="space-y-2">
                        {[82, 64, 92, 54].map((w, i) => (
                          <span key={i} className="block h-2 rounded-full bg-white/15">
                            <span className="progress-fill block h-full rounded-full bg-yellow-300" style={{ width: `${w}%`, animationDelay: `${i * 0.18}s` }} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 animate-fade-in sm:grid-cols-3 lg:col-span-2 lg:justify-self-center" style={{ animationDelay: "0.5s", opacity: 0 }}>
            {[
              { v: "50+", l: "Projects Delivered", icon: Rocket },
              { v: "100%", l: "Client Satisfaction", icon: Heart },
              { v: "5/5", l: "Average Rating", icon: Star },
            ].map((s, i) => (
              <div key={s.l} className="motion-card flex min-h-[128px] flex-col items-center justify-center gap-2 rounded-2xl border border-yellow-300/30 bg-black/40 p-5 shadow-elegant backdrop-blur-md transition-all duration-700 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-[0_24px_70px_rgba(250,204,21,0.24)]">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-yellow-300 text-black animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="font-number text-2xl font-bold text-yellow-300 sm:text-3xl md:text-4xl">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 translate-y-1/2 lg:block">
            <div className="grid h-24 w-20 place-items-center rounded-t-full bg-yellow-300 text-black shadow-[0_0_50px_rgba(250,204,21,0.45)]">
              <div className="text-center">
                <Mouse className="mx-auto mb-1 h-6 w-6" />
                <span className="text-[10px] font-bold">Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
