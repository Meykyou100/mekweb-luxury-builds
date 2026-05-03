import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: p1, title: "Parapharmacie", category: "Site e-commerce Maroc", result: "Boutique claire", desc: "Présentation produits, catégories lisibles et parcours d'achat rassurant." },
  { img: p2, title: "Traiteur", category: "Site vitrine", result: "Demandes de devis", desc: "Pages élégantes pour menus, événements, galerie et contact WhatsApp." },
  { img: p3, title: "Agence de nettoyage", category: "Service local", result: "Leads qualifiés", desc: "Site web Rabat pensé pour inspirer confiance et recevoir des demandes rapides." },
  { img: p4, title: "Climatisation / frigoriste", category: "Service technique", result: "Appels directs", desc: "Structure simple pour services, zones d'intervention, urgence et devis." },
  { img: p1, title: "Sécurité / gardiennage", category: "Service professionnel", result: "Image fiable", desc: "Site sérieux pour présenter prestations, zones couvertes, équipes et contact rapide." },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <div data-reveal="scale">
            <p className="eyebrow mb-4">Réalisations</p>
            <h2 className="section-title">
              Réalisations de sites web
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              Des exemples de sites pour entreprises marocaines : parapharmacie, traiteur, nettoyage, frigoriste et autres métiers locaux.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {projects.map((p, i) => (
            <div key={p.title} data-reveal="scale" data-reveal-delay={i * 120}>
              <article className="premium-card motion-card overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={p.img}
                    alt={`${p.title} - réalisation MekWeb Agency`}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="bg-yellow-50 p-5 text-black sm:p-7">
                  <div className="flex items-end justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-black/70 sm:text-xs sm:tracking-[0.2em]">{p.category}</p>
                      <h3 className="mb-2 font-display text-2xl font-bold leading-tight text-black md:text-3xl">{p.title}</h3>
                      <p className="inline-block rounded-full border border-black/20 bg-yellow-300 px-3 py-1 text-xs font-bold text-black sm:text-sm">
                        {p.result}
                      </p>
                      <p className="mt-3 text-sm font-medium text-black/78">
                        {p.desc}
                      </p>
                    </div>
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold sm:h-12 sm:w-12">
                      <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row" data-reveal="scale">
          <Button asChild variant="hero" size="lg" className="h-auto min-h-12 w-full px-6 py-4 sm:w-auto">
            <a href="#contact">Demander un devis <ArrowRight /></a>
          </Button>
          <Button asChild variant="outlineGold" size="lg" className="h-auto min-h-12 w-full px-6 py-4 sm:w-auto">
            <a href="#contact">Créer un projet similaire</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
