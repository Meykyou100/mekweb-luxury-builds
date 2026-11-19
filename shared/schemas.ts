import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { projectTypes, relevantFeatures, requestStatuses } from "./catalog.js";
const cleanText = (s: string) =>
  [...s].every((c) => {
    const n = c.charCodeAt(0);
    return (n >= 32 && !(n >= 127 && n <= 159)) || [9, 10, 13].includes(n);
  });
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maximum ${max} caractères`)
    .refine(cleanText, "Caractères non autorisés");
const required = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Ce champ est requis")
    .max(max, `Maximum ${max} caractères`)
    .refine(cleanText, "Caractères non autorisés");
export function normalizePhone(value: string) {
  const p = parsePhoneNumberFromString(value, "MA");
  return p?.isValid() ? p.number : null;
}
export const requestFields = z
  .object({
    projectType: z.enum(
      projectTypes.map((p) => p.id) as [string, ...string[]],
      { required_error: "Choisissez un type de projet" },
    ),
    packageId: z.enum(["essential", "business", "ecommerce", ""]).default(""),
    businessName: required(160),
    sector: text(120),
    existingWebsite: text(500).refine(
      (v) => !v || (/^https?:\/\//i.test(v) && URL.canParse(v)),
      "Indiquez une URL complète (https://…)",
    ),
    businessDescription: text(2500),
    objective: required(1500),
    audience: text(800),
    pages: z.enum(["1", "2-5", "6-10", "10+", "unknown"]),
    style: text(160),
    branding: z.enum(["ready", "partial", "needed", "unknown"]),
    content: z.enum(["ready", "partial", "needed", "unknown"]),
    languages: z
      .array(z.enum(["fr", "ar", "en", "other"]))
      .min(1, "Choisissez au moins une langue")
      .max(4),
    features: z.array(z.string().max(40)).max(9),
    budget: z.enum([
      "under-1500",
      "1500-2500",
      "2500-5000",
      "5000-10000",
      "10000+",
      "unknown",
    ]),
    launchDate: text(10).refine(
      (v) =>
        !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))),
      "Date invalide",
    ),
    urgency: z.enum(["flexible", "1month", "3months", "discuss"]),
    priorities: z
      .array(z.enum(["design", "speed", "visibility", "sales", "ease"]))
      .max(5),
    notes: text(4000),
    fullName: required(120),
    companyName: text(160),
    email: z
      .string()
      .trim()
      .email("Indiquez une adresse email valide")
      .max(254),
    phone: text(40).refine(
      (v) => !v || Boolean(normalizePhone(v)),
      "Indiquez un numéro marocain ou international valide",
    ),
    contactMethod: z.enum(["email", "phone", "whatsapp"]),
    city: text(100),
    consent: z
      .boolean()
      .refine(
        Boolean,
        "Veuillez confirmer la prise de connaissance de la notice",
      ),
  })
  .strict();
export const requestSchema = requestFields.superRefine((v, ctx) => {
  if (v.contactMethod !== "email" && !v.phone)
    ctx.addIssue({
      code: "custom",
      path: ["phone"],
      message: "Un numéro est nécessaire pour ce mode de contact",
    });
  if (v.projectType === "redesign" && !v.existingWebsite)
    ctx.addIssue({
      code: "custom",
      path: ["existingWebsite"],
      message: "Indiquez le site à refondre",
    });
  if (
    v.features.some(
      (id) => !relevantFeatures(v.projectType).some((f) => f.id === id),
    )
  )
    ctx.addIssue({
      code: "custom",
      path: ["features"],
      message: "Vérifiez les fonctionnalités adaptées à votre projet",
    });
});
export type ProjectRequest = z.infer<typeof requestFields>;
export const defaultRequest: ProjectRequest = {
  projectType: "",
  packageId: "",
  businessName: "",
  sector: "",
  existingWebsite: "",
  businessDescription: "",
  objective: "",
  audience: "",
  pages: "unknown",
  style: "",
  branding: "unknown",
  content: "unknown",
  languages: ["fr"],
  features: ["contact"],
  budget: "unknown",
  launchDate: "",
  urgency: "discuss",
  priorities: [],
  notes: "",
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  contactMethod: "email",
  city: "",
  consent: false,
};
export const submitSchema = z
  .object({
    request: requestSchema,
    idempotencyKey: z.string().uuid(),
    challengeToken: z.string().min(1).max(4096),
    website: z.string().max(0),
    documentIds: z.array(z.string().uuid()).max(3).default([]),
    uploadSession: z.string().max(200).optional(),
  })
  .strict();
export const requestUpdateSchema = z
  .object({
    status: z.enum(requestStatuses),
    priority: z.enum(["low", "normal", "high"]),
    internal_notes: text(10000),
  })
  .strict();
export const clientUpdateSchema = z
  .object({
    full_name: required(120),
    company_name: text(160),
    email: z
      .string()
      .trim()
      .email("Indiquez une adresse email valide")
      .max(254),
    phone: text(40).refine((v) => !v || Boolean(normalizePhone(v))),
    city: text(100),
    internal_notes: text(10000),
  })
  .strict();
export const quoteItemSchema = z
  .object({
    description: required(2000),
    quantity: z
      .string()
      .regex(/^\d{1,6}(\.\d{1,3})?$/, "Quantité invalide")
      .refine((v) => Number(v) > 0),
    unit_price_cents: z.number().int().min(0).max(100000000),
    discount_bps: z.number().int().min(0).max(10000),
  })
  .strict();
export const quoteDraftSchema = z
  .object({
    client_id: z.string().uuid(),
    request_id: z.string().uuid().nullable(),
    title: required(200),
    description: text(5000),
    expires_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    delivery_estimate: text(1000),
    payment_terms: required(3000),
    notes: text(4000),
    tax_mode: z.enum(["unconfigured", "standard", "exempt", "not_applicable"]),
    tax_bps: z.number().int().min(0).max(10000),
    tax_note: text(1000),
    items: z.array(quoteItemSchema).min(1).max(60),
    expected_revision: z.number().int().min(0).default(0),
  })
  .strict();
export type QuoteDraft = z.infer<typeof quoteDraftSchema>;
export const agencySchema = z
  .object({
    name: required(160),
    email: z
      .string()
      .trim()
      .email("Indiquez une adresse email valide")
      .max(254),
    phone: required(40),
    city: required(100),
    address: text(500),
    ice: text(100),
    tax_id: text(100),
    rc: text(100),
    cnss: text(100),
    legal_verified: z.boolean(),
    tax_configured: z.boolean(),
    tax_mode: z.enum(["unconfigured", "standard", "exempt", "not_applicable"]),
    tax_bps: z.number().int().min(0).max(10000),
    tax_note: text(1000),
    payment_terms: text(3000),
    acceptance_instructions: text(2000),
    privacy_notice: text(15000),
    privacy_verified: z.boolean(),
    retention_days: z.number().int().min(1).max(3650).nullable(),
    confirmation_emails: z.boolean(),
  })
  .strict();
export const pricingSchema = z
  .object({
    name: required(160),
    description: text(2000),
    unit_price_cents: z.number().int().min(0).max(100000000).nullable(),
    active: z.boolean(),
  })
  .strict();
