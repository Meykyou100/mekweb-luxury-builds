import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  initialSession,
  sealSession,
  openSession,
  safeEqual,
  checkOrigin,
  HttpError,
} from "./core";
import { validMagic } from "./jobs";
import type { IncomingMessage } from "node:http";
beforeEach(() => {
  vi.stubEnv("SESSION_ENCRYPTION_KEY", Buffer.alloc(32, 7).toString("base64"));
  vi.stubEnv("APP_ORIGIN", "https://www.mekwebagency.com");
});
afterEach(() => vi.unstubAllEnvs());
describe("Server security boundaries", () => {
  it("encrypts session credentials and rejects tampering", () => {
    const s = initialSession("secret-access", "secret-refresh", 9999999999),
      value = sealSession(s);
    expect(value).not.toContain("secret-access");
    expect(openSession(value)).toEqual(s);
    const b = Buffer.from(value, "base64url");
    b[35] ^= 1;
    expect(openSession(b.toString("base64url"))).toBeNull();
  });
  it("checks equality without leaking credential length through exceptions", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
  it("rejects absent or cross-site mutation origins", () => {
    expect(() =>
      checkOrigin({
        headers: { origin: "https://evil.example" },
      } as IncomingMessage),
    ).toThrow(HttpError);
    expect(() => checkOrigin({ headers: {} } as IncomingMessage)).toThrow();
    expect(() =>
      checkOrigin({
        headers: { origin: "https://www.mekwebagency.com" },
      } as IncomingMessage),
    ).not.toThrow();
  });
  it("checks document magic bytes instead of trusting browser MIME", () => {
    expect(validMagic(Buffer.from("%PDF-1.7"), "application/pdf")).toBe(true);
    expect(validMagic(Buffer.from("<script>"), "application/pdf")).toBe(false);
    expect(
      validMagic(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), "image/png"),
    ).toBe(true);
  });
});
