import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Combien coûte un site web ?",
    a: "Le prix dépend du type de site, du nombre de pages et des fonctionnalités. Les packs commencent à partir de 1500 DH.",
  },
  {
    q: "Combien de temps faut-il pour créer un site ?",
    a: "Un site vitrine simple peut être prêt en quelques jours après réception du contenu. Un projet plus complet demande plus de temps.",
  },
  {
    q: "Est-ce que le site fonctionne sur téléphone ?",
    a: "Oui. Chaque site est responsive et adapté au mobile, à la tablette et à l'ordinateur.",
  },
  {
    q: "Est-ce que vous gérez le domaine et l'hébergement ?",
    a: "Nous pouvons vous accompagner pour choisir, connecter et configurer le domaine et l'hébergement.",
  },
  {
    q: "Est-ce que je peux modifier mon site après la livraison ?",
    a: "Oui. Nous pouvons faire des modifications après livraison ou proposer un suivi de maintenance.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
          <div data-reveal="left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-2">
              <HelpCircle className="h-4 w-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.22em] text-gold">FAQ</span>
            </div>
            <h2 className="section-title mb-5">FAQ</h2>
            <p className="section-copy max-w-xl">
              Les questions les plus fréquentes avant de créer un site web professionnel avec MekWeb.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`item-${index}`}
                data-reveal="right"
                data-reveal-delay={index * 80}
                className="premium-card motion-card px-5 py-1 sm:px-6"
              >
                <AccordionTrigger className="text-left font-display text-lg font-bold leading-snug hover:text-gold hover:no-underline sm:text-xl">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-muted-foreground">
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
