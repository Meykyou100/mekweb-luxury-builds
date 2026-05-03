import { useState } from "react";
import { z } from "zod";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const projectTypes = ["Restaurant website", "E-commerce", "Service business", "Redesign"];
const businessTypes = ["Restaurant", "Local service", "Online store", "Startup / SaaS", "Other"];
const budgetRanges = ["1000-1500 DH", "1500-2500 DH", "2500+ DH", "Not sure yet"];
const whatsappNumber = "212708465603";
const displayPhone = "+212 708-465603";
const secondPhone = "+212 762-971653";
const secondPhoneNumber = "212762971653";
const contactEmail = "mekwebagency@gmail.com";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(6, "Phone or WhatsApp required").max(40),
  email: z.string().trim().email("Valid email required").max(255),
  businessType: z.string().trim().min(1, "Choose a business type"),
  projectType: z.string().trim().min(1, "Choose a project type"),
  budget: z.string().trim().min(1, "Choose a budget range"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    businessType: businessTypes[0],
    projectType: projectTypes[0],
    budget: budgetRanges[0],
    message: "",
  });
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
      const message = [
        "Bonjour, je veux un devis pour un site web.",
        "",
        `Nom: ${form.name}`,
        `Telephone / WhatsApp: ${form.phone}`,
        `Email: ${form.email}`,
        `Type de business: ${form.businessType}`,
        `Type de projet: ${form.projectType}`,
        `Budget: ${form.budget}`,
        "",
        `Message: ${form.message}`,
      ].join("\n");

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      toast.success("Your devis request is ready in WhatsApp.");
      setForm({ name: "", phone: "", email: "", businessType: businessTypes[0], projectType: projectTypes[0], budget: budgetRanges[0], message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <section id="contact" className="relative section-pad section-surface">
      <div className="container-luxe">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div data-reveal="left">
            <p className="eyebrow mb-4">Get In Touch</p>
            <h2 className="section-title mb-5">Let's build your next website</h2>
            <div className="mb-5 inline-block max-w-full rounded-full border border-gold/30 bg-gold/10 px-4 py-2">
              <p className="text-sm font-semibold text-gold">Response in less than 24 hours</p>
            </div>
            <p className="section-copy mb-8">
              Share a few details and we will reply with a clear next step, estimated scope, and ideas to improve conversions.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { icon: Phone, label: "Phone / WhatsApp", value: displayPhone, href: `https://wa.me/${whatsappNumber}` },
                { icon: Phone, label: "Second Number", value: secondPhone, href: `tel:+${secondPhoneNumber}` },
                { icon: Mail, label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
                { icon: MapPin, label: "Location", value: "Morocco / Remote" },
                { icon: Clock, label: "Working hours", value: "Mon - Sat, 9:00 - 18:00" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="premium-card motion-card flex items-center gap-4 p-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10">
                    <item.icon className="h-5 w-5 text-gold" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-widest text-muted-foreground">{item.label}</span>
                    <span className="block break-words font-medium">{item.value}</span>
                  </span>
                </a>
              ))}
            </div>

            <Button asChild variant="outlineGold" size="lg" className="mt-5 h-auto min-h-12 w-full px-5 py-4 sm:w-auto">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                Contact on WhatsApp <MessageCircle />
              </a>
            </Button>
          </div>

          <form onSubmit={onSubmit} data-reveal="right" data-reveal-delay="120" className="premium-card motion-card relative border-gold/25 p-5 sm:p-7 md:p-8">
            <div className="absolute inset-0 -z-10 rounded-full bg-gold/10 blur-3xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} className="h-12 rounded-xl border-border/60 bg-input/60 text-base focus-visible:ring-gold" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Phone / WhatsApp</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 708-465603" maxLength={40} className="h-12 rounded-xl border-border/60 bg-input/60 text-base focus-visible:ring-gold" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" maxLength={255} className="h-12 rounded-xl border-border/60 bg-input/60 text-base focus-visible:ring-gold" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Business type</label>
                <select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="h-12 w-full rounded-xl border border-border/60 bg-input/60 px-3 text-base outline-none ring-offset-background focus:ring-2 focus:ring-gold">
                  {businessTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Project type</label>
                <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="h-12 w-full rounded-xl border border-border/60 bg-input/60 px-3 text-base outline-none ring-offset-background focus:ring-2 focus:ring-gold">
                  {projectTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Budget range</label>
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="h-12 w-full rounded-xl border border-border/60 bg-input/60 px-3 text-base outline-none ring-offset-background focus:ring-2 focus:ring-gold">
                  {budgetRanges.map((budget) => <option key={budget}>{budget}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your goals, timeline, and what you want the website to do..." rows={5} maxLength={1000} className="resize-none rounded-xl border-border/60 bg-input/60 text-base focus-visible:ring-gold" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="hero" size="lg" disabled={loading} className="h-auto min-h-12 w-full flex-wrap whitespace-normal px-5 py-4 text-center animate-glow-pulse">
                  {loading ? "Preparing..." : (<>Send Devis Request <Send /></>)}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
