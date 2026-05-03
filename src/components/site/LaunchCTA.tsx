import { ArrowRight, CalendarCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const whatsappNumber = "212708465603";
const callMessage = encodeURIComponent("Bonjour MekWeb, je veux demander un devis pour la création de mon site web.");

export const LaunchCTA = () => {
  return (
    <section className="relative section-pad">
      <div className="container-luxe">
        <div data-reveal="scale" className="premium-card motion-card overflow-hidden border-gold/25 p-6 text-center sm:p-10 lg:p-12">
          <p className="eyebrow mb-4">Prêt à lancer ?</p>
          <h2 className="section-title mx-auto max-w-3xl">
            Prêt à créer votre site web ?
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Contactez MekWeb aujourd'hui pour créer un site professionnel, moderne et prêt à convertir vos visiteurs en clients.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl" className="h-auto min-h-14 w-full px-7 py-4 sm:w-auto">
              <a href={`https://wa.me/${whatsappNumber}?text=${callMessage}`} target="_blank" rel="noopener noreferrer">
                Demander un devis <CalendarCheck />
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="xl" className="h-auto min-h-14 w-full px-7 py-4 sm:w-auto">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                Contact WhatsApp <MessageCircle />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
