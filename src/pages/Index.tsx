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
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-gold grid place-items-center shadow-gold animate-glow-pulse hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
      </a>
    </div>
  );
};

export default Index;
