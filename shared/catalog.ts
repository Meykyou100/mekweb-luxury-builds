export const projectTypes = [
  {
    id: "showcase",
    label: "Site vitrine",
    description: "Présenter votre activité et faciliter le contact.",
  },
  {
    id: "corporate",
    label: "Site corporate",
    description: "Valoriser votre entreprise, vos équipes et vos expertises.",
  },
  {
    id: "ecommerce",
    label: "Boutique e-commerce",
    description: "Présenter et vendre vos produits en ligne.",
  },
  {
    id: "landing",
    label: "Landing page",
    description: "Une page ciblée pour une offre ou une campagne.",
  },
  {
    id: "redesign",
    label: "Refonte de site",
    description: "Repenser votre site actuel et son expérience.",
  },
  {
    id: "webapp",
    label: "Application web",
    description: "Un outil adapté à votre métier et vos utilisateurs.",
  },
  {
    id: "other",
    label: "Autre projet",
    description: "Échangeons pour définir la bonne solution.",
  },
] as const;
export const packages = [
  {
    id: "essential",
    name: "Pack Essentiel",
    price: "à partir de 1 500 DH",
    projectType: "showcase",
  },
  {
    id: "business",
    name: "Pack Business",
    price: "à partir de 2 500 DH",
    projectType: "corporate",
  },
  {
    id: "ecommerce",
    name: "Pack E-commerce",
    price: "sur devis",
    projectType: "ecommerce",
  },
] as const;
export const features = [
  { id: "contact", label: "Formulaire de contact" },
  { id: "whatsapp", label: "Contact WhatsApp" },
  { id: "booking", label: "Réservation en ligne" },
  { id: "catalogue", label: "Catalogue de produits" },
  { id: "payments", label: "Paiement en ligne" },
  { id: "blog", label: "Blog / actualités" },
  { id: "cms", label: "Modifier moi-même les contenus" },
  { id: "accounts", label: "Comptes clients" },
  { id: "integrations", label: "Connexion à d’autres outils" },
] as const;
export function relevantFeatures(type: string) {
  return features.filter(
    (f) =>
      !(
        type === "landing" &&
        ["catalogue", "payments", "accounts", "blog", "cms"].includes(f.id)
      ) && !(type === "showcase" && ["payments", "accounts"].includes(f.id)),
  );
}
export const requestStatuses = [
  "new",
  "under_review",
  "contacted",
  "quoted",
  "accepted",
  "rejected",
  "archived",
] as const;
export const statusLabels: Record<string, string> = {
  new: "Nouvelle",
  under_review: "À l’étude",
  contacted: "Contact établi",
  quoted: "Devis préparé",
  accepted: "Accepté",
  rejected: "Non retenu",
  archived: "Archivé",
  draft: "Brouillon",
  finalized: "Finalisé",
  sent: "Envoyé",
  expired: "Expiré",
  cancelled: "Annulé",
  active: "En cours",
  planned: "Planifié",
  completed: "Terminé",
  on_hold: "En pause",
};
export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(
    cents / 100,
  );
