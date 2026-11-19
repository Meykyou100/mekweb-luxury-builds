import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { handler } from "./router";
let server: Server, origin: string;
beforeAll(async () => {
  vi.stubEnv("APP_ORIGIN", "http://127.0.0.1");
  vi.stubEnv("SUPABASE_URL", "");
  server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw Error("No test listener");
  origin = `http://127.0.0.1:${address.port}`;
  vi.stubEnv("APP_ORIGIN", origin);
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((e) => (e ? reject(e) : resolve())),
  );
  vi.unstubAllEnvs();
});
describe("Real HTTP server fail-closed behavior without cloud configuration", () => {
  it("does not expose private data to an unauthenticated request", async () => {
    const r = await fetch(`${origin}/api/admin/requests`);
    expect(r.status).toBe(401);
    const b = await r.json();
    expect(b.code).toBe("UNAUTHENTICATED");
    expect(b).not.toHaveProperty("items");
    expect(r.headers.get("cache-control")).toBe("no-store");
  });
  it("reports collection unavailable instead of simulating saved requests", async () => {
    const r = await fetch(`${origin}/api/public/config`);
    expect(await r.json()).toEqual({
      requestsEnabled: false,
      uploadsEnabled: false,
      agency: null,
    });
    const submit = await fetch(`${origin}/api/project-requests`, {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body: "{}",
    });
    expect(submit.status).toBe(503);
    expect(await submit.json()).not.toHaveProperty("reference");
  });
  it("rejects cross-origin writes before any persistence operation", async () => {
    const r = await fetch(`${origin}/api/project-requests`, {
      method: "POST",
      headers: {
        origin: "https://example.org",
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    expect(r.status).toBe(403);
  });
});
