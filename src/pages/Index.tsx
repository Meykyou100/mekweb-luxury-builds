import { lazy, Suspense } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const HowItWorks = lazy(() => import("@/components/site/HowItWorks").then((module) => ({ default: module.HowItWorks })));
const Portfolio = lazy(() => import("@/components/site/Portfolio").then((module) => ({ default: module.Portfolio })));
const LaunchCTA = lazy(() => import("@/components/site/LaunchCTA").then((module) => ({ default: module.LaunchCTA })));
const About = lazy(() => import("@/components/site/About").then((module) => ({ default: module.About })));
const FAQ = lazy(() => import("@/components/site/FAQ").then((module) => ({ default: module.FAQ })));
const Contact = lazy(() => import("@/components/site/Contact").then((module) => ({ default: module.Contact })));

const Index = () => {
  useScrollReveal();

  return (
    <div className="animated-page min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
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
