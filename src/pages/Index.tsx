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
    </div>
  );
};

export default Index;
