import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LaunchCTA = () => {
  return (
    <section className="relative section-pad">
      <div className="container-luxe">
        <div data-reveal="scale" className="premium-card motion-card overflow-hidden border-gold/25 p-6 text-center sm:p-10 lg:p-12">
          <p className="eyebrow mb-4">Ready when you are</p>
          <h2 className="section-title mx-auto max-w-3xl">
            Ready to launch your website?
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Tell us what you want to build and we will help you choose the fastest path to a polished, conversion-ready website.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl" className="h-auto min-h-14 w-full px-7 py-4 sm:w-auto">
              <a href="#contact">Get a free quote <ArrowRight /></a>
            </Button>
            <Button asChild variant="outlineGold" size="xl" className="h-auto min-h-14 w-full px-7 py-4 sm:w-auto">
              <a href="https://wa.me/15555555555" target="_blank" rel="noopener noreferrer">
                Contact on WhatsApp <MessageCircle />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
