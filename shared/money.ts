import type { QuoteDraft } from "./schemas";
const rounded = (n: bigint, d: bigint) => (n + d / 2n) / d;
export function decimalToCents(input: string): number {
  if (!/^\d{1,9}([.,]\d{1,2})?$/.test(input.trim()))
    throw new Error("Montant invalide");
  const [units, fraction = ""] = input.trim().replace(",", ".").split(".");
  return Number(BigInt(units) * 100n + BigInt(fraction.padEnd(2, "0")));
}
export function calculateQuote(items: QuoteDraft["items"], taxBps: number) {
  if (!Number.isInteger(taxBps) || taxBps < 0 || taxBps > 10000)
    throw new Error("Taxe invalide");
  const lines = items.map((item) => {
    if (
      !/^\d{1,6}(\.\d{1,3})?$/.test(item.quantity) ||
      Number(item.quantity) <= 0 ||
      !Number.isSafeInteger(item.unit_price_cents) ||
      item.unit_price_cents < 0 ||
      !Number.isInteger(item.discount_bps) ||
      item.discount_bps < 0 ||
      item.discount_bps > 10000
    )
      throw new Error("Ligne invalide");
    const [units, fraction = ""] = item.quantity.split(".");
    const quantity = BigInt(units) * 1000n + BigInt(fraction.padEnd(3, "0"));
    const gross = rounded(quantity * BigInt(item.unit_price_cents), 1000n);
    const discount = rounded(gross * BigInt(item.discount_bps), 10000n);
    return {
      gross_cents: Number(gross),
      discount_cents: Number(discount),
      net_cents: Number(gross - discount),
    };
  });
  const subtotal = lines.reduce((n, l) => n + BigInt(l.net_cents), 0n);
  const tax = rounded(subtotal * BigInt(taxBps), 10000n);
  const total = subtotal + tax;
  if (total > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error("Montant trop élevé");
  return {
    lines,
    subtotal_cents: Number(subtotal),
    tax_cents: Number(tax),
    total_cents: Number(total),
  };
}
