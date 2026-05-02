import { Star } from "lucide-react";
import a1 from "@/assets/avatar-1.jpg";
import a2 from "@/assets/avatar-2.jpg";
import a3 from "@/assets/avatar-3.jpg";

const reviews = [
  {
    name: "Sarah Chen",
    business: "Restaurant owner",
    avatar: a1,
    quote: "MekWeb created a polished booking experience that made customers trust us faster. The site feels premium and simple to use.",
  },
  {
    name: "Marcus Bennett",
    business: "SaaS founder",
    avatar: a2,
    quote: "The page is fast, refined, and much easier for prospects to understand. The structure helped us explain our offer clearly.",
  },
  {
    name: "Daniel Reyes",
    business: "Local service business",
    avatar: a3,
    quote: "I never imagined our website could look this professional. Calls improved quickly and customers mention the site often.",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="relative section-pad">
      <div className="container-luxe">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14" data-reveal="scale">
          <p className="eyebrow mb-4">Client Love</p>
          <h2 className="section-title">
            Proof from clients who needed results
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Premium design only matters when it makes the business easier to trust and easier to contact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review, i) => (
            <article key={review.name} data-reveal="scale" data-reveal-delay={i * 100} className="premium-card motion-card flex h-full flex-col p-6">
              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="flex-1 text-base leading-7 text-foreground/90">"{review.quote}"</p>
              <div className="mt-7 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="h-14 w-14 rounded-full border-2 border-gold/30 object-cover"
                />
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-sm text-muted-foreground">{review.business}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
