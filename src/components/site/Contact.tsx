import { useState } from "react";
import { z } from "zod";
import { Send, MessageCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Thanks! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-luxe">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-start">
          <div data-reveal="left">
            <p className="text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gold mb-4">Get In Touch</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-5 sm:mb-6">
              Let's build your{" "}
              <span className="text-gradient-gold italic">website</span>
            </h2>
            <div className="inline-block max-w-full px-3 sm:px-4 py-2 rounded-full border border-gold/30 bg-gold/10 mb-5 sm:mb-6">
              <p className="text-xs sm:text-sm font-semibold text-gold">🎁 Free website preview — no commitment</p>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Tell us about your project. We'll reply within 24 hours with a free
              strategy call and a custom mockup to show you what's possible.
            </p>

            <div className="space-y-4">
              <a href="mailto:hello@mekweb.com" className="motion-card flex items-center gap-4 p-4 rounded-2xl border border-border/60 hover:-translate-y-1 hover:border-gold/40 transition-all duration-300 group">
                <span className="w-11 h-11 rounded-xl bg-gold/10 grid place-items-center group-hover:bg-gold/20 transition">
                  <Mail className="w-5 h-5 text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                  <div className="font-medium break-words">hello@mekweb.com</div>
                </div>
              </a>
              <a href="https://wa.me/15555555555" target="_blank" rel="noopener noreferrer" className="motion-card flex items-center gap-4 p-4 rounded-2xl border border-border/60 hover:-translate-y-1 hover:border-gold/40 transition-all duration-300 group">
                <span className="w-11 h-11 rounded-xl bg-gold/10 grid place-items-center group-hover:bg-gold/20 transition">
                  <MessageCircle className="w-5 h-5 text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</div>
                  <div className="font-medium">Chat with us instantly</div>
                </div>
              </a>
              <div className="motion-card flex items-center gap-4 p-4 rounded-2xl border border-border/60">
                <span className="w-11 h-11 rounded-xl bg-gold/10 grid place-items-center">
                  <MapPin className="w-5 h-5 text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Working Globally</div>
                  <div className="font-medium">Remote-first team</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} data-reveal="right" data-reveal-delay="120" className="motion-card relative p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-card-gradient border border-gold/20 shadow-elegant">
            <div className="absolute inset-0 -z-10 bg-gold/10 blur-3xl rounded-full" />
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Your name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  maxLength={100}
                  className="h-12 bg-input/60 border-border/60 focus-visible:ring-gold rounded-xl text-base"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Email address</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@company.com"
                  maxLength={255}
                  className="h-12 bg-input/60 border-border/60 focus-visible:ring-gold rounded-xl text-base"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Project details</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your goals, timeline, and budget…"
                  rows={5}
                  maxLength={1000}
                  className="bg-input/60 border-border/60 focus-visible:ring-gold rounded-xl resize-none text-base"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={loading} className="h-auto min-h-12 w-full flex-wrap whitespace-normal px-5 py-4 text-center animate-glow-pulse">
                {loading ? "Sending…" : (<>Get My Free Website Preview <Send /></>)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
