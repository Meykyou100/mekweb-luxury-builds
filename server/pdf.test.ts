import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { renderQuote } from "./pdf";
import type { Snapshot } from "./models";
export const testSnapshot: Snapshot = {
  reference: "TEST-NON-EMIS",
  version: 0,
  issued_at: "2026-11-17T12:00:00Z",
  expires_on: "2026-12-17",
  title: "Projet de vérification du moteur PDF",
  description:
    "Document de contrôle technique. Ce document n’est pas une offre commerciale.",
  delivery_estimate: "Calendrier de test uniquement.",
  payment_terms: "Conditions de test uniquement. Aucun engagement commercial.",
  notes: "Vérification des accents : création, identité, qualité, échéance.",
  tax_mode: "unconfigured",
  tax_note: "Fiscalité non configurée dans cette fixture de test.",
  tax_bps: 0,
  subtotal_cents: 0,
  tax_cents: 0,
  total_cents: 0,
  currency: "MAD",
  client: {
    full_name: "Client de vérification محلي",
    company_name: "Fixture de test uniquement",
    email: "test@example.com",
    phone: "",
    city: "Rabat",
  },
  agency: {
    name: "MekWeb Agency",
    email: "mekwebagency@gmail.com",
    phone: "+212708465603",
    city: "Rabat, Maroc",
    address: "",
    ice: "",
    tax_id: "",
    rc: "",
    cnss: "",
    acceptance_instructions: "Aucune acceptation possible : document de test.",
  },
  items: Array.from({ length: 45 }, (_, i) => ({
    description: `Prestation de vérification ${i + 1} : contrôle de la mise en page, des descriptions et des sauts de page. Aucun tarif commercial n’est proposé.`,
    quantity: "1",
    unit_price_cents: 0,
    discount_bps: 0,
    net_cents: 0,
    gross_cents: 0,
    discount_cents: 0,
  })),
};
describe("Actual PDF generation (test fixture only)", () => {
  it("renders a branded multi-page A4 draft with real fonts and no fabricated legal data", async () => {
    const bytes = await renderQuote(testSnapshot, true);
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(10000);
    const target = new URL("../.local/qa/", import.meta.url);
    mkdirSync(target, { recursive: true });
    writeFileSync(new URL("quotation-layout-test.pdf", target), bytes);
  });
});
