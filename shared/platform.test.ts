import { describe, it, expect } from "vitest";
import {
  requestSchema,
  defaultRequest,
  normalizePhone,
  submitSchema,
} from "./schemas";
import { calculateQuote, decimalToCents } from "./money";
const request = {
  ...defaultRequest,
  projectType: "showcase",
  businessName: "Activité locale",
  objective: "Présenter nos services",
  fullName: "Client test",
  email: "test@example.com",
  consent: true,
};
describe("Project brief validation", () => {
  it("accepts an email-first request without forcing a phone number", () => {
    expect(requestSchema.safeParse(request).success).toBe(true);
  });
  it("supports Moroccan local mobile/landline and international formats", () => {
    expect(normalizePhone("0612345678")).toBe("+212612345678");
    expect(normalizePhone("0537123456")).toBe("+212537123456");
    expect(normalizePhone("+33142345678")).toBe("+33142345678");
    expect(normalizePhone("123")).toBeNull();
  });
  it("requires a phone for WhatsApp and a website for redesign", () => {
    expect(
      requestSchema.safeParse({ ...request, contactMethod: "whatsapp" })
        .success,
    ).toBe(false);
    expect(
      requestSchema.safeParse({ ...request, projectType: "redesign" }).success,
    ).toBe(false);
  });
  it("rejects irrelevant features and missing consent on the server schema", () => {
    expect(
      requestSchema.safeParse({ ...request, features: ["payments"] }).success,
    ).toBe(false);
    expect(
      requestSchema.safeParse({ ...request, consent: false }).success,
    ).toBe(false);
  });
  it("rejects honeypot submissions and unknown data keys", () => {
    const value = {
      request,
      idempotencyKey: "adf03b1f-5fe0-44f8-8901-f704fa2d3f06",
      challengeToken: "t",
      website: "spam",
    };
    expect(submitSchema.safeParse(value).success).toBe(false);
    expect(requestSchema.safeParse({ ...request, admin: true }).success).toBe(
      false,
    );
  });
});
describe("Commercial calculations in centimes", () => {
  it("parses currency exactly without floating point multiplication", () => {
    expect(decimalToCents("1500,50")).toBe(150050);
    expect(decimalToCents("0.29")).toBe(29);
    expect(() => decimalToCents("1.234")).toThrow();
  });
  it("rounds quantity and per-line discounts before tax", () => {
    const r = calculateQuote(
      [
        {
          description: "Service",
          quantity: "1.005",
          unit_price_cents: 101,
          discount_bps: 1000,
        },
      ],
      2000,
    );
    expect(r.lines[0]).toEqual({
      gross_cents: 102,
      discount_cents: 10,
      net_cents: 92,
    });
    expect(r.tax_cents).toBe(18);
    expect(r.total_cents).toBe(110);
  });
  it("handles tax-not-applicable and full discounts", () => {
    expect(
      calculateQuote(
        [
          {
            description: "Service",
            quantity: "1",
            unit_price_cents: 150000,
            discount_bps: 10000,
          },
        ],
        0,
      ).total_cents,
    ).toBe(0);
  });
  it("rejects invalid money, quantities and rates", () => {
    expect(() =>
      calculateQuote(
        [
          {
            description: "x",
            quantity: "-1",
            unit_price_cents: 100,
            discount_bps: 0,
          },
        ],
        0,
      ),
    ).toThrow();
    expect(() => calculateQuote([], -1)).toThrow();
  });
});
