import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Combien de temps prend la création d'un site web ?",
    a: "Un site vitrine est souvent prêt en 1 à 3 semaines selon le contenu, les pages et les retours. Un site e-commerce peut demander plus de temps.",
  },
  {
    q: "MekWeb travaille avec des entreprises partout au Maroc ?",
    a: "Oui. MekWeb Agency accompagne les entreprises à Rabat et dans tout le Maroc pour la création de sites web professionnels.",
  },
  {
    q: "Le site sera-t-il responsive sur mobile ?",
    a: "Oui. Chaque site est pensé mobile-first, puis ajusté pour tablette et ordinateur afin d'avoir une expérience propre sur tous les écrans.",
  },
  {
    q: "Est-ce que le SEO est inclus ?",
    a: "Oui. Nous préparons les bases SEO : titres, meta description, structure claire, performance et contenus adaptés à votre activité.",
  },
  {
    q: "Pouvez-vous refaire un ancien site web ?",
    a: "Oui. Nous pouvons moderniser le design, améliorer la version mobile, clarifier les messages et rendre le site plus orienté conversion.",
  },
  {
    q: "Le domaine et l'hébergement sont-ils inclus ?",
    a: "Les frais de domaine et d'hébergement sont séparés, mais nous pouvons vous aider à choisir la bonne solution et tout connecter avant le lancement.",
  },
  {
    q: "Puis-je modifier le site plus tard ?",
    a: "Oui. Nous pouvons faire des petites mises à jour après lancement ou proposer une maintenance si vous voulez un suivi régulier.",
  },
  {
    q: "De quoi avez-vous besoin pour commencer ?",
    a: "Envoyez les informations de votre entreprise, votre logo si vous en avez un, vos services et quelques exemples de sites que vous aimez.",
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
              FAQ
            </h2>
            <p className="section-copy max-w-xl">
              Réponses rapides sur la création de site web Maroc, le SEO, les délais et le lancement.
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
