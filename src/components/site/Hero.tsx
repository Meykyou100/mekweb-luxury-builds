import { useState } from "react";
import { ArrowRight, CalendarCheck, Heart, Rocket, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveNewsletterEmail } from "@/lib/newsletter";

const whatsappNumber = "212708465603";
const callMessage = encodeURIComponent("Bonjour MekWeb, je veux demander un devis pour la création de mon site web.");

export const Hero = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const onNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = newsletterEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSavingEmail(true);
    try {
      await saveNewsletterEmail({ email, source: "hero_newsletter" });
      toast.success("Email saved. You will receive news and blog updates.");
      setNewsletterEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this email right now.");
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#1d1d1b] pb-20 pt-24 text-white sm:pt-28 lg:pb-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/mekweb-office-hero.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
      </div>

      <div className="container-luxe relative z-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1fr)] lg:gap-16">
          <div className="max-w-2xl text-left">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-yellow-300/50 bg-black/25 px-4 py-2 shadow-elegant">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="truncate text-[10px] uppercase tracking-[0.18em] text-yellow-100 sm:text-xs">MekWeb Agency Maroc</span>
            </div>

            <h1 className="mb-6 max-w-3xl font-sans text-[clamp(2.35rem,6.4vw,5.8rem)] font-black uppercase leading-[0.98] tracking-tight text-white [text-wrap:balance]">
              Création de sites web professionnels <span className="text-yellow-300">au Maroc</span>
            </h1>

            <p className="mb-6 max-w-xl text-base leading-7 text-white/86 sm:text-lg">
              MekWeb Agency aide les entreprises locales à Rabat et partout au Maroc à obtenir un site web moderne, rapide et professionnel qui attire des clients.
            </p>

            <form onSubmit={onNewsletterSubmit} className="mb-8 flex max-w-md overflow-hidden rounded-lg border border-yellow-300/80 bg-black/20 p-1">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Enter Email Address"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button type="submit" aria-label="Save email for news and blog updates" disabled={savingEmail} className="grid w-14 place-items-center rounded-md bg-white/45 text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg" className="h-auto min-h-12 w-full px-6 py-4 sm:w-auto">
                <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer">
                  Demander un devis <CalendarCheck />
                </a>
              </Button>
              <Button asChild variant="outlineGold" size="lg" className="h-auto min-h-12 w-full border-white/40 px-6 py-4 text-white hover:bg-yellow-300 hover:text-black sm:w-auto">
                <a href="#portfolio">Voir nos réalisations <ArrowRight /></a>
              </Button>
            </div>

            <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer" className="mb-8 inline-flex items-center gap-2 rounded-full border border-yellow-300/50 bg-yellow-300 px-5 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:-translate-y-1">
              Contact WhatsApp <CalendarCheck className="h-4 w-4" />
            </a>

            <div>
              <ArrowRight className="idea-arrow mb-3 h-8 w-8 text-yellow-300" />
              <p className="max-w-lg text-[clamp(1.9rem,4.5vw,3.2rem)] font-black uppercase leading-[1.02] tracking-tight text-yellow-300">
                Transformez votre présence en ligne en clients
              </p>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-2 lg:justify-self-center">
            {[
              { v: "50+", l: "Projects Delivered", icon: Rocket },
              { v: "100%", l: "Client Satisfaction", icon: Heart },
              { v: "5/5", l: "Average Rating", icon: Star },
            ].map((s, i) => (
              <div key={s.l} className="motion-card flex min-h-[128px] flex-col items-center justify-center gap-2 rounded-2xl border border-yellow-300/30 bg-black/50 p-5 shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-yellow-300 text-black">
                  <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="font-number text-2xl font-bold text-yellow-300 sm:text-3xl md:text-4xl">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
