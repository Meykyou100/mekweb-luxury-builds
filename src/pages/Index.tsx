import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { Services } from "@/components/site/Services";
import { Pricing } from "@/components/site/Pricing";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Portfolio } from "@/components/site/Portfolio";
import { Technologies } from "@/components/site/Technologies";
import { LaunchCTA } from "@/components/site/LaunchCTA";
import { About } from "@/components/site/About";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Index = () => {
  useScrollReveal();
  const whatsappNumber = "212762971653";
  const whatsappMessage = encodeURIComponent("Bonjour, je veux un devis pour un site web.");

  return (
    <div className="animated-page min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Pricing />
        <HowItWorks />
        <Portfolio />
        <Technologies />
        <LaunchCTA />
        <About />
        <Testimonials />
        <FAQ />
        <BeforeAfter />
        <Contact />
      </main>
      <Footer />

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-1 z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-l-full rounded-r-none bg-gradient-gold px-4 py-3 font-black text-primary-foreground shadow-gold animate-glow-pulse transition-transform hover:-translate-y-1 sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))] sm:right-0 sm:px-5"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="hidden text-sm sm:inline">WhatsApp</span>
      </a>
    </div>
  );
};

export default Index;
