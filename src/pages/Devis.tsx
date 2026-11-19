import { useEffect, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  ShoppingBag,
  Layout,
  RefreshCw,
  Building2,
  AppWindow,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Challenge } from "@/components/crm/Challenge";
import {
  DocumentUpload,
  type UploadResult,
} from "@/components/crm/DocumentUpload";
import { api, ApiError, type PublicConfig } from "@/lib/platform-api";
import {
  defaultRequest,
  requestSchema,
  type ProjectRequest,
} from "../../shared/schemas";
import { packages, projectTypes, relevantFeatures } from "../../shared/catalog";
import "@/platform.css";
const steps = [
  "Votre projet",
  "Votre activité",
  "Vos besoins",
  "Budget & délai",
  "Vos coordonnées",
  "Récapitulatif",
];
const fields: FieldPath<ProjectRequest>[][] = [
  ["projectType"],
  [
    "businessName",
    "sector",
    "existingWebsite",
    "businessDescription",
    "objective",
    "audience",
  ],
  ["pages", "style", "branding", "content", "languages", "features"],
  ["budget", "launchDate", "urgency", "priorities", "notes"],
  [
    "fullName",
    "companyName",
    "email",
    "phone",
    "contactMethod",
    "city",
    "consent",
  ],
  [],
];
const icons = [
  Code2,
  Building2,
  ShoppingBag,
  Layout,
  RefreshCw,
  AppWindow,
  Sparkles,
];
const labels: Record<string, string> = {
  ready: "Oui, tout est prêt",
  partial: "En partie",
  needed: "J’ai besoin d’aide",
  unknown: "Je ne sais pas encore",
  flexible: "Je suis flexible",
  "1month": "Dans le mois",
  "3months": "Sous trois mois",
  discuss: "À définir ensemble",
  "under-1500": "Moins de 1 500 DH",
  "1500-2500": "1 500 à 2 500 DH",
  "2500-5000": "2 500 à 5 000 DH",
  "5000-10000": "5 000 à 10 000 DH",
  "10000+": "Plus de 10 000 DH",
  email: "Email",
  phone: "Téléphone",
  whatsapp: "WhatsApp",
  fr: "Français",
  ar: "Arabe",
  en: "Anglais",
  other: "Autre",
  design: "Une image soignée",
  speed: "Un site rapide",
  visibility: "Être trouvé en ligne",
  sales: "Développer les ventes",
  ease: "Une gestion simple",
};
export default function Devis() {
  const [params] = useSearchParams();
  const selected = packages.find((p) => p.id === params.get("pack"));
  const form = useForm<ProjectRequest>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      ...defaultRequest,
      ...(selected
        ? { packageId: selected.id, projectType: selected.projectType }
        : {}),
    },
    shouldUnregister: false,
  });
  const {
    register,
    watch,
    trigger,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = form;
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setMessage] = useState(""),
    [reference, setReference] = useState(""),
    [token, setToken] = useState(""),
    [challengeReset, setChallengeReset] = useState(0),
    [upload, setUpload] = useState<UploadResult | null>(null),
    [uploadPending, setUploadPending] = useState(false);
  const key = useRef(crypto.randomUUID()),
    honeypot = useRef<HTMLInputElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    inflight = useRef(false);
  const config = useQuery({
    queryKey: ["public-config"],
    queryFn: () => api<PublicConfig>("public/config"),
    retry: false,
    staleTime: 60000,
  });
  const type = watch("projectType"),
    contact = watch("contactMethod"),
    consent = watch("consent");
  useEffect(() => {
    document.title = "Votre projet, notre prochaine création | MekWeb";
    return () => {
      document.title = "Création site web Maroc | MekWeb Agency";
    };
  }, []);
  useEffect(() => {
    setValue(
      "features",
      getValues("features").filter((id) =>
        relevantFeatures(type).some((f) => f.id === id),
      ),
    );
  }, [type, getValues, setValue]);
  function go(n: number) {
    setStep(n);
    setMessage("");
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  async function next() {
    if (await trigger(fields[step], { shouldFocus: true })) {
      if (step === 4 && uploadPending && !upload) {
        setMessage("Vérifiez ou retirez les documents avant de poursuivre.");
        return;
      }
      go(step + 1);
    }
  }
  const submit = handleSubmit(async (value) => {
    if (inflight.current) return;
    if (!config.data?.requestsEnabled || !token) {
      setMessage(
        "L’envoi n’est pas disponible ou la vérification de sécurité a expiré.",
      );
      return;
    }
    inflight.current = true;
    setBusy(true);
    setMessage("");
    try {
      const result = await api<{ saved: boolean; reference: string }>(
        "project-requests",
        {
          method: "POST",
          data: {
            request: value,
            idempotencyKey: key.current,
            challengeToken: token,
            website: honeypot.current?.value ?? "",
            documentIds: upload?.ids ?? [],
            uploadSession: upload?.capability,
          },
        },
      );
      if (!result.saved || !result.reference)
        throw new Error("La confirmation d’enregistrement est indisponible.");
      setReference(result.reference);
      form.reset(defaultRequest);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (e) {
      if (e instanceof ApiError)
        e.fields.forEach((f) => {
          const field = f.path.replace(
            /^request\./,
            "",
          ) as FieldPath<ProjectRequest>;
          if (field in defaultRequest) setError(field, { message: f.message });
        });
      setMessage(
        e instanceof Error
          ? e.message
          : "L’envoi n’a pas abouti. Vos informations sont conservées dans le formulaire.",
      );
      setChallengeReset((n) => n + 1);
    } finally {
      setBusy(false);
      inflight.current = false;
    }
  });
  const field = (
    name: FieldPath<ProjectRequest>,
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      area?: boolean;
      full?: boolean;
      required?: boolean;
    } = {},
  ) => (
    <div className={options.full ? "field-full" : ""}>
      <label htmlFor={`brief-${name}`} className="field-label">
        {label}
        {!options.required && <span> · facultatif</span>}
      </label>
      {options.area ? (
        <textarea
          id={`brief-${name}`}
          {...register(name)}
          rows={4}
          className="studio-input"
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
        />
      ) : (
        <input
          id={`brief-${name}`}
          {...register(name)}
          type={options.type ?? "text"}
          placeholder={options.placeholder}
          autoComplete={
            name === "fullName"
              ? "name"
              : name === "email"
                ? "email"
                : name === "phone"
                  ? "tel"
                  : undefined
          }
          className="studio-input"
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
        />
      )}{" "}
      {errors[name] && (
        <p id={`error-${name}`} className="field-error">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
  const select = (
    name: FieldPath<ProjectRequest>,
    label: string,
    values: [string, string][],
  ) => (
    <div>
      <label className="field-label" htmlFor={`brief-${name}`}>
        {label}
      </label>
      <select id={`brief-${name}`} {...register(name)} className="studio-input">
        {values.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
  const choices = (
    name: "languages" | "features" | "priorities",
    title: string,
    values: { id: string; label: string }[],
  ) => (
    <fieldset className="field-full">
      <legend className="field-label">{title}</legend>
      <div className="check-grid">
        {values.map((v) => (
          <label key={v.id} className="check-option">
            <input type="checkbox" value={v.id} {...register(name)} />
            <span>{v.label}</span>
          </label>
        ))}
      </div>
      {errors[name] && (
        <p className="field-error" role="alert">
          {errors[name]?.message}
        </p>
      )}
    </fieldset>
  );
  const data = getValues();
  return (
    <div className="platform-public">
      <header className="brief-header container-luxe">
        <Link to="/" aria-label="MekWeb — Accueil">
          <BrandLogo />
        </Link>
        <Link to="/" className="text-link">
          <ArrowLeft size={15} />
          Retour au studio
        </Link>
      </header>
      {reference ? (
        <main className="brief-success container-luxe">
          <CheckCircle2 size={44} strokeWidth={1} />
          <p className="eyebrow">Votre projet est entre de bonnes mains</p>
          <h1>
            Votre demande
            <br />
            est <em>enregistrée.</em>
          </h1>
          <p>
            Référence : <strong>{reference}</strong>
          </p>
          <p>
            Nous étudierons votre brief avant de revenir vers vous. Aucun devis
            commercial n’a encore été émis. La livraison d’un éventuel email de
            confirmation n’est pas garantie par cet écran.
          </p>
          <Link to="/" className="platform-button">
            Retour au studio <ArrowUpRight size={16} />
          </Link>
        </main>
      ) : (
        <main className="brief-layout container-luxe">
          <aside className="brief-aside">
            <p className="eyebrow">Votre prochaine étape digitale</p>
            <h1>
              Une ambition.
              <br />
              <em>Un projet à vous.</em>
            </h1>
            <p>
              Quelques questions pour comprendre votre activité et imaginer la
              bonne solution, ensemble.
            </p>
            <ol className="brief-steps">
              {steps.map((label, index) => (
                <li
                  key={label}
                  className={
                    index === step ? "current" : index < step ? "complete" : ""
                  }
                  aria-current={index === step ? "step" : undefined}
                >
                  <span>
                    {index < step ? (
                      <Check size={13} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <button
                    type="button"
                    disabled={index > step}
                    onClick={() => go(index)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ol>
            {selected && (
              <div className="selected-pack">
                <span>Point de départ</span>
                <strong>{selected.name}</strong>
                <p>
                  {selected.price} · Offre indicative, à confirmer après étude.
                </p>
              </div>
            )}
            <p className="brief-trust">
              Sans création de compte.
              <br />
              Aucun engagement commercial automatique.
            </p>
          </aside>
          <section className="brief-panel" aria-label="Demande de devis">
            <div className="brief-progress">
              <span>ÉTAPE {step + 1} SUR 6</span>
              <span>{Math.round(((step + 1) / 6) * 100)} %</span>
              <div
                role="progressbar"
                aria-label="Avancement de votre demande"
                aria-valuemin={1}
                aria-valuemax={6}
                aria-valuenow={step + 1}
              >
                <i style={{ width: `${((step + 1) / 6) * 100}%` }} />
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 5) void submit(e);
                else void next();
              }}
              noValidate
            >
              <div className="brief-step" key={step}>
                <p className="eyebrow">{steps[step]}</p>
                <h2 ref={heading} tabIndex={-1}>
                  {
                    [
                      "Que souhaitez-vous créer ?",
                      "Parlons de votre activité.",
                      "Une expérience à votre image.",
                      "Vos repères, à votre rythme.",
                      "Faisons connaissance.",
                      "Tout est prêt ?",
                    ][step]
                  }
                </h2>
                {step === 0 && (
                  <>
                    <p className="form-note">
                      Choisissez l’option la plus proche de votre idée. Nous
                      affinerons ensemble.
                    </p>
                    <fieldset className="project-choices">
                      <legend className="sr-only">Type de projet</legend>
                      {projectTypes.map((p, index) => {
                        const Icon = icons[index];
                        return (
                          <label key={p.id} className="project-choice">
                            <input
                              type="radio"
                              value={p.id}
                              {...register("projectType")}
                            />
                            <Icon size={23} strokeWidth={1.3} />
                            <span>
                              <strong>{p.label}</strong>
                              <small>{p.description}</small>
                            </span>
                            <span className="choice-dot" />
                          </label>
                        );
                      })}
                    </fieldset>
                    {errors.projectType && (
                      <p className="field-error" role="alert">
                        {errors.projectType.message}
                      </p>
                    )}
                  </>
                )}
                {step === 1 && (
                  <div className="form-fields">
                    {field(
                      "businessName",
                      "Nom de votre entreprise ou marque",
                      { required: true },
                    )}
                    {field("sector", "Votre secteur d’activité", {
                      placeholder: "Restaurant, commerce, profession libérale…",
                    })}
                    {field(
                      "existingWebsite",
                      type === "redesign"
                        ? "Le site à refondre"
                        : "Votre site actuel",
                      {
                        type: "url",
                        placeholder: "https://…",
                        full: true,
                        required: type === "redesign",
                      },
                    )}
                    {field(
                      "businessDescription",
                      "Votre activité en quelques mots",
                      { area: true, full: true },
                    )}
                    {field(
                      "objective",
                      "Que souhaitez-vous accomplir avec ce site ?",
                      { area: true, full: true, required: true },
                    )}
                    {field("audience", "À qui s’adresse votre activité ?", {
                      full: true,
                    })}
                  </div>
                )}
                {step === 2 && (
                  <div className="form-fields">
                    {select("pages", "Nombre de pages envisagé", [
                      ["unknown", labels.unknown],
                      ["1", "Une page"],
                      ["2-5", "2 à 5 pages"],
                      ["6-10", "6 à 10 pages"],
                      ["10+", "Plus de 10 pages"],
                    ])}
                    {select("style", "Univers visuel", [
                      ["", "À définir ensemble"],
                      ["Épuré et éditorial", "Épuré et éditorial"],
                      [
                        "Chaleureux et accueillant",
                        "Chaleureux et accueillant",
                      ],
                      ["Moderne et affirmé", "Moderne et affirmé"],
                      ["Institutionnel et sobre", "Institutionnel et sobre"],
                    ])}
                    {select(
                      "branding",
                      "Logo et identité visuelle",
                      ["unknown", "ready", "partial", "needed"].map((v) => [
                        v,
                        labels[v],
                      ]),
                    )}
                    {select(
                      "content",
                      "Textes et photographies",
                      ["unknown", "ready", "partial", "needed"].map((v) => [
                        v,
                        labels[v],
                      ]),
                    )}
                    {choices(
                      "languages",
                      "Langues souhaitées",
                      ["fr", "ar", "en", "other"].map((id) => ({
                        id,
                        label: labels[id],
                      })),
                    )}
                    {choices(
                      "features",
                      "Ce que votre site doit permettre",
                      relevantFeatures(type),
                    )}
                  </div>
                )}
                {step === 3 && (
                  <div className="form-fields">
                    {select(
                      "budget",
                      "Votre budget indicatif",
                      [
                        "unknown",
                        "under-1500",
                        "1500-2500",
                        "2500-5000",
                        "5000-10000",
                        "10000+",
                      ].map((v) => [v, labels[v]]),
                    )}
                    {select(
                      "urgency",
                      "Quand souhaitez-vous avancer ?",
                      ["discuss", "flexible", "1month", "3months"].map((v) => [
                        v,
                        labels[v],
                      ]),
                    )}
                    {field("launchDate", "Une date de lancement souhaitée", {
                      type: "date",
                      full: true,
                    })}
                    {choices(
                      "priorities",
                      "Ce qui compte le plus pour vous",
                      ["design", "speed", "visibility", "sales", "ease"].map(
                        (id) => ({ id, label: labels[id] }),
                      ),
                    )}
                    {field(
                      "notes",
                      "Une précision, une inspiration, une contrainte ?",
                      { area: true, full: true },
                    )}
                    <p className="form-note field-full">
                      Ces indications nous aident à cadrer votre projet. Seul un
                      devis préparé et validé par MekWeb précisera le prix et
                      les conditions.
                    </p>
                  </div>
                )}
                {step === 4 && (
                  <div className="form-fields">
                    {field("fullName", "Nom et prénom", { required: true })}
                    {field("companyName", "Société, si différente")}
                    {field("email", "Votre email", {
                      type: "email",
                      required: true,
                    })}
                    {select(
                      "contactMethod",
                      "Votre préférence de contact",
                      ["email", "phone", "whatsapp"].map((v) => [v, labels[v]]),
                    )}
                    {field("phone", "Téléphone / WhatsApp", {
                      type: "tel",
                      placeholder: "06… ou +212…",
                      required: contact !== "email",
                    })}
                    {field("city", "Votre ville")}
                    <div className="privacy-box field-full">
                      <p>
                        Vos informations servent à étudier votre projet et à
                        vous recontacter. La notice décrit les destinataires, la
                        conservation et vos droits.
                      </p>
                      <Link
                        to="/confidentialite"
                        target="_blank"
                        className="text-link"
                      >
                        Lire la notice de confidentialité{" "}
                        <ArrowUpRight size={13} />
                      </Link>
                      <label className="check-option">
                        <input type="checkbox" {...register("consent")} />
                        <span>
                          J’ai pris connaissance de la notice et je souhaite
                          être recontacté au sujet de mon projet.
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="field-error" role="alert">
                          {errors.consent.message}
                        </p>
                      )}
                    </div>
                    {config.data?.uploadsEnabled ? (
                      <div className="field-full">
                        <DocumentUpload
                          sessionKey={key.current}
                          consent={consent}
                          onReady={(v) => {
                            setUpload(v);
                            setUploadPending(v === null);
                          }}
                          onReset={() => {
                            key.current = crypto.randomUUID();
                            setUploadPending(false);
                          }}
                        />
                      </div>
                    ) : (
                      <p className="form-note field-full">
                        Les pièces jointes ne sont pas activées pour le moment.
                        Décrivez vos éléments dans les notes ; nous pourrons
                        convenir d’un échange sécurisé.
                      </p>
                    )}
                  </div>
                )}
                {step === 5 && (
                  <>
                    <p className="form-note">
                      Relisez votre brief avant l’envoi. Vous pouvez revenir sur
                      chaque étape.
                    </p>
                    <div className="brief-summary">
                      {[
                        [
                          "Votre projet",
                          [
                            projectTypes.find((t) => t.id === data.projectType)
                              ?.label,
                            packages.find((p) => p.id === data.packageId)?.name,
                          ],
                        ],
                        [
                          "Votre activité",
                          [
                            data.businessName,
                            data.sector,
                            data.existingWebsite,
                            data.businessDescription,
                            data.objective,
                            data.audience,
                          ],
                        ],
                        [
                          "Vos besoins",
                          [
                            data.pages === "unknown"
                              ? labels.unknown
                              : `${data.pages} page(s)`,
                            data.style,
                            `Identité : ${labels[data.branding]}`,
                            `Contenus : ${labels[data.content]}`,
                            data.languages.map((v) => labels[v]).join(", "),
                            relevantFeatures(type)
                              .filter((f) => data.features.includes(f.id))
                              .map((f) => f.label)
                              .join(", "),
                          ],
                        ],
                        [
                          "Budget et délai",
                          [
                            labels[data.budget],
                            data.launchDate,
                            labels[data.urgency],
                            data.priorities.map((v) => labels[v]).join(", "),
                            data.notes,
                          ],
                        ],
                        [
                          "Vos coordonnées",
                          [
                            data.fullName,
                            data.companyName,
                            data.email,
                            data.phone,
                            data.city,
                            `Contact : ${labels[data.contactMethod]}`,
                            upload
                              ? `${upload.ids.length} document(s) vérifié(s)`
                              : "Sans pièce jointe",
                          ],
                        ],
                      ].map(([label, values], index) => (
                        <div key={String(label)}>
                          <div className="summary-heading">
                            <h3>{label}</h3>
                            <button type="button" onClick={() => go(index)}>
                              Modifier
                            </button>
                          </div>
                          {(values as (string | undefined)[])
                            .filter(Boolean)
                            .map((v, i) => (
                              <p key={i}>{v}</p>
                            ))}
                        </div>
                      ))}
                    </div>
                    <input
                      ref={honeypot}
                      className="honeypot"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                    <Challenge onToken={setToken} resetKey={challengeReset} />
                    <p className="form-note">
                      En cliquant sur « Envoyer ma demande », vous confirmez
                      l’envoi de ce brief à MekWeb. Aucun compte ni achat n’est
                      créé.
                    </p>
                  </>
                )}
              </div>
              {!config.isPending && !config.data?.requestsEnabled && (
                <div className="platform-notice" role="status">
                  L’enregistrement en ligne n’est pas encore ouvert. Vous pouvez
                  préparer votre brief, puis nous joindre à{" "}
                  <a href="mailto:mekwebagency@gmail.com">
                    mekwebagency@gmail.com
                  </a>{" "}
                  ou sur{" "}
                  <a
                    href="https://wa.me/212708465603"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                  .
                </div>
              )}
              {error && (
                <p className="platform-error" role="alert">
                  {error}
                </p>
              )}
              <div className="brief-controls">
                {step > 0 ? (
                  <button
                    className="platform-button secondary"
                    type="button"
                    onClick={() => go(step - 1)}
                    disabled={busy}
                  >
                    <ArrowLeft size={16} />
                    Précédent
                  </button>
                ) : (
                  <span />
                )}
                {step < 5 ? (
                  <button className="platform-button" type="submit">
                    Continuer <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    className="platform-button"
                    type="submit"
                    disabled={busy || !config.data?.requestsEnabled || !token}
                  >
                    {busy ? "Enregistrement…" : "Envoyer ma demande"}
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </div>
            </form>
          </section>
        </main>
      )}
      <footer className="brief-footer container-luxe">
        <span>© {new Date().getFullYear()} MekWeb Agency</span>
        <Link to="/confidentialite">Confidentialité</Link>
        <span>Rabat, Maroc</span>
      </footer>
    </div>
  );
}
