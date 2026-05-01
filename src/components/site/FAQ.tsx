import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does a website project take?",
    a: "Most business websites are ready in 2 to 4 weeks, depending on the number of pages, content, and revision rounds.",
  },
  {
    q: "Can you redesign my old website?",
    a: "Yes. We can refresh the look, improve mobile performance, rewrite the structure, and make the website more focused on leads and sales.",
  },
  {
    q: "Will the website work on phones?",
    a: "Yes. Every page is built mobile-first, then refined for tablets and desktops so the design feels smooth on every screen size.",
  },
  {
    q: "Do you help with SEO?",
    a: "Yes. We set up the technical SEO basics, clean page structure, fast loading, metadata, and content sections that help customers find you.",
  },
  {
    q: "How does payment work?",
    a: "Projects can start with a deposit, then the remaining balance is paid before launch. The exact payment split can be agreed before work begins.",
  },
  {
    q: "Is domain and hosting included?",
    a: "Domain and hosting costs are separate, but we can help you choose the right setup and connect everything before launch.",
  },
  {
    q: "Can I update the website later?",
    a: "Yes. We can add small updates after launch, or set up a maintenance plan if you want ongoing edits and improvements.",
  },
  {
    q: "What do I need to start?",
    a: "Send your business details, logo if you have one, the services you offer, and a few examples of websites you like. We can guide the rest.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-20 sm:py-24 lg:py-32 bg-secondary/30">
      <div className="container-luxe">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div data-reveal="left">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gold/30 bg-gold/10 mb-5">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.22em] text-gold">FAQ</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-5">
              Questions before we <span className="text-gradient-gold italic">build?</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Clear answers about timing, mobile design, SEO, and what we need from you to start.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                data-reveal="right"
                data-reveal-delay={i * 80}
                className="motion-card rounded-2xl border border-border/60 bg-card-gradient px-5 sm:px-6 shadow-elegant transition-all duration-500 hover:border-gold/40 hover:shadow-gold-soft"
              >
                <AccordionTrigger className="text-left font-display text-lg sm:text-xl font-bold hover:text-gold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
