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
    <section id="faq" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12 items-start">
          <div data-reveal="left">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gold/30 bg-gold/10 mb-5">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.22em] text-gold">FAQ</span>
            </div>
            <h2 className="section-title mb-5">
              Questions before we start?
            </h2>
            <p className="section-copy max-w-xl">
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
                className="premium-card motion-card px-5 py-1 sm:px-6"
              >
                <AccordionTrigger className="text-left font-display text-lg sm:text-xl font-bold leading-snug hover:text-gold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-7">
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
