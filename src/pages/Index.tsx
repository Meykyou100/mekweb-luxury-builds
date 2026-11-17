import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const HowItWorks = lazy(() =>
  import("@/components/site/HowItWorks").then((module) => ({
    default: module.HowItWorks,
  })),
);
const Portfolio = lazy(() =>
  import("@/components/site/Portfolio").then((module) => ({
    default: module.Portfolio,
  })),
);
const LaunchCTA = lazy(() =>
  import("@/components/site/LaunchCTA").then((module) => ({
    default: module.LaunchCTA,
  })),
);
const About = lazy(() =>
  import("@/components/site/About").then((module) => ({
    default: module.About,
  })),
);
const FAQ = lazy(() =>
  import("@/components/site/FAQ").then((module) => ({ default: module.FAQ })),
);
const Contact = lazy(() =>
  import("@/components/site/Contact").then((module) => ({
    default: module.Contact,
  })),
);

const Index = () => {
  useScrollReveal();

  useEffect(() => {
    // A shared section URL may resolve before the lazy section is mounted.
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return;
    const observer = new MutationObserver(scrollToSection);
    function scrollToSection() {
      const target = document.getElementById(sectionId);
      if (!target) return;
      target.scrollIntoView({ block: "start", behavior: "instant" });
      observer.disconnect();
    }
    observer.observe(document.body, { childList: true, subtree: true });
    scrollToSection();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="animated-page min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Services />
        <Suspense fallback={null}>
          <Portfolio />
          <About />
          <HowItWorks />
          <Pricing />
          <FAQ />
          <LaunchCTA />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
