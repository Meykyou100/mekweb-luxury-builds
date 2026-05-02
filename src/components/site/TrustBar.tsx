import { ArrowRight, Code2, Heart, MessageCircle, SearchCheck, Smartphone, ThumbsUp, Users } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";

const items = [
  { icon: MessageCircle, title: "Social Media Marketing", desc: "Clear messaging and landing pages built to convert visitors into leads." },
  { icon: SearchCheck, title: "SEO Ready", desc: "Clean structure, page speed, and visibility basics for long-term growth." },
  { icon: Smartphone, title: "Mobile First", desc: "Layouts that feel polished on phones, tablets, laptops, and desktops." },
  { icon: Code2, title: "Website Development", desc: "Custom React websites with refined spacing, animation, and launch support." },
];

export const TrustBar = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-yellow-300 via-yellow-200 to-yellow-50 py-16 text-black sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute right-16 top-16 hidden h-20 w-20 rotate-45 border-[18px] border-black border-b-transparent border-l-transparent lg:block" />
      <div className="pointer-events-none absolute bottom-24 left-8 hidden space-y-2 lg:block">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block h-4 w-4 rotate-45 border-l-4 border-t-4 border-black" />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-20 right-28 hidden text-5xl font-black tracking-[-0.18em] lg:block">~~~~</div>

      <div className="container-luxe">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div data-reveal="left" className="relative mx-auto w-full max-w-sm">
            <div className="mx-auto aspect-[9/16] w-48 rotate-[-15deg] rounded-[2rem] border-[10px] border-[#1d1d1b] bg-yellow-200 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.22)] sm:w-56">
              <div className="mx-auto mb-16 h-3 w-16 rounded-full bg-[#1d1d1b]" />
              <div className="grid h-full place-items-center rounded-2xl border-2 border-[#1d1d1b]/20">
                <div className="text-center">
                  <BrandLogo className="flex-col gap-3" markClassName="h-16 w-16 rounded-2xl border-[#1d1d1b]" textClassName="text-lg tracking-[0.18em] text-[#1d1d1b]" />
                </div>
              </div>
            </div>
          </div>

          <div data-reveal="right" className="max-w-2xl">
            <h2 className="mb-3 font-sans text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-none tracking-tight">
              Make it digital
            </h2>
            <p className="mb-6 max-w-xl text-base leading-7 text-black/78 sm:text-lg">
              A professional website gives your business a serious first impression, clear offers, and a direct path for customers to contact you.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1d1d1b] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-1"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-[1fr_1.25fr]">
          <div data-reveal="left">
            <h3 className="font-sans text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Our Digital<br />Marketing Expertise
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-black/70 sm:text-base">
              Strategy, design, development, and launch support for local brands that want to look professional online.
            </p>
          </div>

          <div data-reveal="right" className="rounded-xl bg-[#1d1d1b] p-5 text-white shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid h-20 w-24 shrink-0 place-items-center rounded-lg border-2 border-yellow-300 text-yellow-300">
                <Code2 className="h-11 w-11" />
              </div>
              <div>
                <h4 className="mb-1 text-lg font-black text-yellow-300">Website Design & Development</h4>
                <p className="mb-3 text-sm leading-6 text-white/70">
                  Premium pages, conversion sections, contact paths, and responsive layouts for every screen.
                </p>
                <a href="#services" className="inline-flex rounded-md bg-white px-4 py-2 text-xs font-black uppercase text-black">Get Started</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.title}
              data-reveal="scale"
              data-reveal-delay={i * 90}
              className="motion-card rounded-lg bg-[#1d1d1b] p-6 text-center text-white shadow-2xl transition-transform duration-500 hover:-translate-y-2"
            >
              <span className="mx-auto mb-5 grid h-20 w-20 place-items-center text-yellow-300">
                <span className="relative grid h-16 w-16 place-items-center rounded-lg border-2 border-yellow-300">
                  <item.icon className="h-8 w-8" />
                  <Heart className="absolute -right-3 -top-3 h-6 w-6 rounded-md border-2 border-yellow-300 bg-[#1d1d1b] p-1" />
                  <ThumbsUp className="absolute -right-4 bottom-0 h-6 w-6 rounded-md border-2 border-yellow-300 bg-[#1d1d1b] p-1" />
                  <Users className="absolute -bottom-4 left-2 h-6 w-6 rounded-md border-2 border-yellow-300 bg-[#1d1d1b] p-1" />
                </span>
              </span>
              <h3 className="mb-3 text-sm font-black text-yellow-300">{item.title}</h3>
              <p className="text-sm leading-6 text-white/72">{item.desc}</p>
              <a href="#contact" className="mt-5 inline-flex rounded-md bg-white px-5 py-2 text-xs font-black uppercase text-black">Get Started</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
