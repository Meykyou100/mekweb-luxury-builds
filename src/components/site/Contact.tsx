import { useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const projectTypes = [
  "Site vitrine",
  "Site e-commerce",
  "Refonte de site web",
  "Maintenance & support",
];
const businessTypes = [
  "Entreprise locale",
  "Restaurant / traiteur",
  "Parapharmacie",
  "Service technique",
  "Autre",
];
const budgetRanges = ["1500 DH", "2500 DH", "Sur devis", "Pas encore sûr"];
const whatsappNumber = "212708465603";
const displayPhone = "+212 708-465603";
const secondPhone = "+212 762-971653";
const secondPhoneNumber = "212762971653";
const contactEmail = "mekwebagency@gmail.com";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nom requis")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  phone: z
    .string()
    .trim()
    .min(6, "Indiquez un numéro de téléphone d’au moins 6 caractères")
    .max(40, "Le numéro ne doit pas dépasser 40 caractères"),
  email: z
    .string()
    .trim()
    .email("Email valide requis")
    .max(255, "L’email ne doit pas dépasser 255 caractères"),
  businessType: z.string().trim().min(1, "Choisissez un type d'entreprise"),
  projectType: z.string().trim().min(1, "Choisissez un type de projet"),
  budget: z.string().trim().min(1, "Choisissez un budget"),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne doit pas dépasser 1 000 caractères"),
});

type ContactForm = z.infer<typeof schema>;
type FieldName = keyof ContactForm;
const initialForm: ContactForm = {
  name: "",
  phone: "",
  email: "",
  businessType: businessTypes[0],
  projectType: projectTypes[0],
  budget: budgetRanges[0],
  message: "",
};

export const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const update = (key: FieldName, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setWhatsappUrl("");
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const nextErrors: Partial<Record<FieldName, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as FieldName;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      const first = result.error.issues[0].path[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const data = result.data;
    const message = [
      "Bonjour, je veux un devis pour un site web.",
      "",
      `Nom: ${data.name}`,
      `Téléphone / WhatsApp: ${data.phone}`,
      `Email: ${data.email}`,
      `Type d’entreprise: ${data.businessType}`,
      `Type de projet: ${data.projectType}`,
      `Budget: ${data.budget}`,
      "",
      `Message: ${data.message}`,
    ].join("\n");
    // Preparation only: the visitor explicitly opens WhatsApp and sends the message there.
    setWhatsappUrl(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    );
    setErrors({});
  };
  const fieldProps = (key: FieldName) => ({
    id: `contact-${key}`,
    name: key,
    value: form[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => update(key, event.target.value),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `error-${key}` : undefined,
    required: true,
    className: "studio-input",
  });
  const error = (key: FieldName) =>
    errors[key] ? (
      <p className="field-error" id={`error-${key}`}>
        {errors[key]}
      </p>
    ) : null;
  const select = (key: FieldName, label: string, options: string[]) => (
    <div>
      <label className="field-label" htmlFor={`contact-${key}`}>
        {label}
      </label>
      <select {...fieldProps(key)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error(key)}
    </div>
  );

  return (
    <section id="contact" className="section-pad">
      <div className="container-luxe contact-layout">
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">07 / Parlons de votre projet</p>
          <h2 className="section-title">
            Une idée en tête ?<br />
            <em>Donnons-lui forme.</em>
          </h2>
          <p className="section-copy">
            Demandez un devis pour votre création site web Maroc. MekWeb Agency
            vous répond avec une proposition claire et adaptée à votre activité.
          </p>
          <div className="contact-details">
            <div className="contact-detail">
              <Phone />
              <div>
                <small>Téléphone / WhatsApp</small>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {displayPhone}
                </a>
              </div>
            </div>
            <div className="contact-detail">
              <Phone />
              <div>
                <small>Deuxième numéro</small>
                <a href={`tel:+${secondPhoneNumber}`}>{secondPhone}</a>
              </div>
            </div>
            <div className="contact-detail">
              <Mail />
              <div>
                <small>Écrivez-nous</small>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
            </div>
            <div className="contact-detail">
              <MapPin />
              <div>
                <small>Notre ancrage</small>
                <span>Rabat, Maroc</span>
              </div>
            </div>
            <div className="contact-detail">
              <Clock />
              <div>
                <small>Horaires</small>
                <span>Du lundi au samedi, de 9 h à 18 h</span>
              </div>
            </div>
          </div>
          <a
            className="text-link mt-5"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Échanger sur WhatsApp <MessageCircle size={16} />
          </a>
        </div>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="contact-form"
          data-reveal
        >
          <div className="form-heading">
            <div>
              <h3>Votre projet commence ici.</h3>
              <p className="form-note">
                Tous les champs sont requis. Préparez votre demande, puis
                envoyez-la dans WhatsApp.
              </p>
            </div>
            <ArrowUpRight size={25} strokeWidth={1.2} />
          </div>
          <div className="form-fields">
            <div>
              <label className="field-label" htmlFor="contact-name">
                Votre nom
              </label>
              <Input
                {...fieldProps("name")}
                autoComplete="name"
                placeholder="Nom et prénom"
                maxLength={100}
              />
              {error("name")}
            </div>
            <div>
              <label className="field-label" htmlFor="contact-phone">
                Téléphone / WhatsApp
              </label>
              <Input
                {...fieldProps("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+212…"
                maxLength={40}
              />
              {error("phone")}
            </div>
            <div className="field-full">
              <label className="field-label" htmlFor="contact-email">
                Votre adresse email
              </label>
              <Input
                {...fieldProps("email")}
                type="email"
                autoComplete="email"
                placeholder="vous@entreprise.ma"
                maxLength={255}
              />
              {error("email")}
            </div>
            {select("businessType", "Votre activité", businessTypes)}
            {select("projectType", "Type de projet", projectTypes)}
            {select("budget", "Budget envisagé", budgetRanges)}
            <div className="field-full">
              <label className="field-label" htmlFor="contact-message">
                Parlez-nous de votre projet
              </label>
              <Textarea
                {...fieldProps("message")}
                placeholder="Votre activité, vos objectifs, vos envies…"
                rows={4}
                maxLength={1000}
              />
              {error("message")}
            </div>
            <div className="field-full">
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Préparer ma demande de devis <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
          {whatsappUrl && (
            <div className="form-status" role="status">
              <p>
                Votre message est prêt. Aucune demande n’a encore été envoyée.
                Ouvrez WhatsApp pour vérifier le message et l’envoyer.
              </p>
              <a
                className="text-link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ouvrir WhatsApp <ArrowUpRight size={15} />
              </a>
              <p>
                Vos informations restent dans ce formulaire si vous souhaitez
                les modifier.
              </p>
            </div>
          )}
          <p className="form-note">
            Le message et les coordonnées saisis seront transmis à WhatsApp
            uniquement lorsque vous ouvrirez le lien. Vous confirmez l’envoi
            dans WhatsApp.
          </p>
        </form>
      </div>
    </section>
  );
};
