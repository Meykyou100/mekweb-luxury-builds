import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const beforeItems = [
  "Outdated design that feels hard to trust",
  "Slow pages that lose mobile visitors",
  "No clear path to call, book, or message",
];

const afterItems = [
  "Premium layout built around your offer",
  "Fast mobile experience with SEO basics",
  "Clear calls to action for more leads",
];

export const BeforeAfter = () => {
  return (
    <section className="relative section-pad">
      <div className="container-luxe">
        <div data-reveal="scale" className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <p className="eyebrow mb-4">Before / After</p>
          <h2 className="section-title">
            Turn a weak website into a lead engine
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <div data-reveal="left" className="premium-card motion-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                <XCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Before</p>
                <h3 className="font-display text-2xl font-bold">Visitors leave too soon</h3>
              </div>
            </div>
            <div className="space-y-3">
              {beforeItems.map((item) => (
                <p key={item} className="rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid place-items-center px-2" aria-hidden="true">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>

          <div data-reveal="right" data-reveal-delay="120" className="premium-card motion-card border-gold/25 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/20 text-gold">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-gold">After</p>
                <h3 className="font-display text-2xl font-bold">Visitors know what to do</h3>
              </div>
            </div>
            <div className="space-y-3">
              {afterItems.map((item) => (
                <p key={item} className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm font-medium text-foreground">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
