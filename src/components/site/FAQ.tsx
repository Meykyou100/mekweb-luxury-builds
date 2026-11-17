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

export const FAQ = () => (
  <section id="faq" className="section-pad">
    <div className="container-luxe faq-layout">
      <div data-reveal>
        <p className="eyebrow">06 / Questions fréquentes</p>
        <h2 className="section-title">
          Tout commence
          <br />
          par un <em>échange.</em>
        </h2>
        <p className="section-copy mt-6">
          Les questions les plus fréquentes avant de créer un site web
          professionnel avec MekWeb.
        </p>
        <a href="#contact" className="text-link mt-6">
          Une autre question ? Parlons-en.
        </a>
      </div>
      <Accordion type="single" collapsible className="studio-accordion">
        {faqs.map((item, index) => (
          <AccordionItem
            key={item.q}
            value={`item-${index}`}
            className="faq-item"
          >
            <AccordionTrigger className="faq-trigger">
              <span>
                <span className="faq-number">0{index + 1}</span>
                {item.q}
              </span>
            </AccordionTrigger>
            <AccordionContent className="faq-answer">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
