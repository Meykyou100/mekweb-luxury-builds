import { lazy, Suspense } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { Services } from "@/components/site/Services";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const HowItWorks = lazy(() => import("@/components/site/HowItWorks").then((module) => ({ default: module.HowItWorks })));
const Portfolio = lazy(() => import("@/components/site/Portfolio").then((module) => ({ default: module.Portfolio })));
const Technologies = lazy(() => import("@/components/site/Technologies").then((module) => ({ default: module.Technologies })));
const LaunchCTA = lazy(() => import("@/components/site/LaunchCTA").then((module) => ({ default: module.LaunchCTA })));
const About = lazy(() => import("@/components/site/About").then((module) => ({ default: module.About })));
const Testimonials = lazy(() => import("@/components/site/Testimonials").then((module) => ({ default: module.Testimonials })));
const FAQ = lazy(() => import("@/components/site/FAQ").then((module) => ({ default: module.FAQ })));
const BeforeAfter = lazy(() => import("@/components/site/BeforeAfter").then((module) => ({ default: module.BeforeAfter })));
const Contact = lazy(() => import("@/components/site/Contact").then((module) => ({ default: module.Contact })));

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
        <Suspense fallback={null}>
          <HowItWorks />
          <Portfolio />
          <Technologies />
          <LaunchCTA />
          <About />
          <Testimonials />
          <FAQ />
          <BeforeAfter />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
