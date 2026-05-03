import {
  ArrowRight,
  Gauge,
  Headphones,
  Monitor,
  Smartphone,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const whatsappNumber = "212708465603";
const callMessage = encodeURIComponent("Bonjour MekWeb, je veux demander un devis pour la création de mon site web.");

const highlights = [
  { icon: Monitor, title: "Design moderne", desc: "& élégant" },
  { icon: Smartphone, title: "100% responsive", desc: "mobile & tablette" },
  { icon: TrendingUp, title: "Optimisé SEO", desc: "pour Google" },
  { icon: Gauge, title: "Rapide &", desc: "performant" },
  { icon: Headphones, title: "Support & suivi", desc: "personnalisé" },
];

const stats = [
  { icon: Users, value: "+50", label: "Projets réalisés" },
  { icon: Star, value: "5.0", label: "Note moyenne Google" },
  { icon: Star, value: "100%", label: "Clients satisfaits" },
];

export const Hero = () => {
  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden bg-black pt-28 text-white sm:pt-32 lg:pt-36">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/mekweb-office-hero.jpg"
          alt=""
          className="h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black" />
        <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_80%_15%,rgba(250,204,21,0.28),transparent_58%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:160px_160px]" />
      </div>

      <div className="container-luxe relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex max-w-full items-center gap-3 rounded-full border border-yellow-300/70 bg-black/35 px-5 py-3 text-yellow-300 shadow-gold-soft">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,.85)]" />
              <span className="truncate text-xs font-black uppercase tracking-[0.18em] sm:text-sm">Agence web au Maroc</span>
            </div>

            <h1 className="max-w-4xl font-sans text-[clamp(3.1rem,7.2vw,6.8rem)] font-black uppercase leading-[0.98] tracking-tight text-white [text-wrap:balance]">
              Création de <span className="text-yellow-300">sites web</span> professionnels
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">
              Nous créons des sites web modernes, rapides et optimisés pour aider votre entreprise à se démarquer et attirer plus de clients.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {highlights.map((item) => (
                <div key={item.title} className="flex flex-col items-center gap-3 text-center">
                  <item.icon className="h-9 w-9 text-yellow-300" strokeWidth={1.8} />
                  <div>
                    <p className="text-[10px] font-black uppercase leading-5 tracking-[0.08em] text-white">{item.title}</p>
                    <p className="text-[10px] font-black uppercase leading-5 tracking-[0.08em] text-white">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="hero" size="lg" className="h-auto min-h-14 w-full rounded-lg px-8 py-4 text-base sm:w-auto">
                <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer">
                  Demander un devis
                </a>
              </Button>
              <Button asChild variant="outlineGold" size="lg" className="h-auto min-h-14 w-full rounded-lg border-white/55 bg-black/20 px-8 py-4 text-base text-white hover:bg-yellow-300 hover:text-black sm:w-auto">
                <a href="#portfolio">
                  <ArrowRight className="h-5 w-5" /> Voir nos réalisations
                </a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[860px] lg:block">
            <div className="absolute -right-16 top-8 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
            <div className="absolute -bottom-14 left-20 h-44 w-96 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="relative ml-auto origin-bottom-right rotate-[-4deg] rounded-[28px] border border-white/25 bg-[#080808] p-4 shadow-[0_40px_110px_rgba(0,0,0,.75)]">
              <div className="rounded-[22px] border border-yellow-300/25 bg-black p-8">
                <div className="mb-14 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/favicon-32.png" alt="" className="h-8 w-8" />
                    <div>
                      <p className="text-xl font-black leading-none text-white">MekWeb</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-300">Agency</p>
                    </div>
                  </div>
                  <div className="flex gap-5 text-[10px] font-semibold text-white/80">
                    <span>Accueil</span>
                    <span>Services</span>
                    <span>Réalisations</span>
                    <span>À propos</span>
                    <span>Contact</span>
                  </div>
                </div>

                <div className="grid min-h-[270px] items-center rounded-2xl bg-[radial-gradient(circle_at_70%_35%,rgba(250,204,21,.22),transparent_42%),linear-gradient(135deg,#10100e,#050505)] p-10">
                  <div className="max-w-md">
                    <p className="text-4xl font-black leading-tight text-white">
                      Des solutions digitales pour <span className="text-yellow-300">développer votre activité</span>
                    </p>
                    <p className="mt-5 text-sm leading-6 text-white/75">
                      Un site web professionnel, pensé pour vos clients et optimisé pour votre croissance.
                    </p>
                    <div className="mt-6 flex gap-3">
                      <span className="rounded-md bg-yellow-300 px-4 py-3 text-xs font-black text-black">Nos services</span>
                      <span className="rounded-md border border-white/40 px-4 py-3 text-xs font-black text-white">Nous contacter</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 border-y border-white/10 py-5 text-center">
                  <div>
                    <p className="font-number text-xl font-black text-yellow-300">+50</p>
                    <p className="text-[10px] text-white/60">Projets réalisés</p>
                  </div>
                  <div>
                    <p className="font-number text-xl font-black text-yellow-300">5.0</p>
                    <p className="text-[10px] text-white/60">Note Google</p>
                  </div>
                  <div>
                    <p className="font-number text-xl font-black text-yellow-300">100%</p>
                    <p className="text-[10px] text-white/60">Clients satisfaits</p>
                  </div>
                </div>

                <p className="mt-8 text-2xl font-black text-white">Nos services</p>
                <div className="mt-5 grid grid-cols-4 gap-4">
                  {[Monitor, Smartphone, TrendingUp, Headphones].map((Icon, index) => (
                    <span key={index} className="grid h-24 place-items-center rounded-xl border border-yellow-300/15 bg-white/[0.03]">
                      <Icon className="h-9 w-9 text-yellow-300" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="mx-auto mt-4 h-3 w-[82%] rounded-b-[28px] bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-950" />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 border-t border-white/15 py-8 sm:grid-cols-3 lg:mt-16">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center justify-center gap-5 border-white/10 sm:justify-start sm:border-r sm:last:border-r-0">
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-yellow-300/18 text-yellow-300 shadow-gold-soft">
                <stat.icon className="h-7 w-7" />
              </span>
              <div>
                <p className="font-number text-3xl font-black leading-none text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-white/68">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
