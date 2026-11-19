import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({
  send: vi.fn(),
  updates: [] as Record<string, unknown>[],
  job: {
    id: "job-1",
    kind: "agency_notification",
    entity_id: "request-1",
    dedupe_key: "notify/request-1",
    attempts: 1,
    created_at: new Date().toISOString(),
    provider_id: null as string | null,
  },
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: state.send };
  },
}));
vi.mock("./core", async () => {
  const actual = await vi.importActual<typeof import("./core")>("./core");
  const db = {
    rpc: vi.fn(async (name: string) => ({
      data: name === "crm_claim_jobs" ? [state.job] : null,
      error: null,
    })),
    from: (table: string) => {
      let payload: Record<string, unknown> | undefined;
      const query = {
        select: () => query,
        delete: () => query,
        update: (v: Record<string, unknown>) => {
          payload = v;
          if (table === "background_jobs") state.updates.push(v);
          return query;
        },
        eq: () => query,
        is: () => query,
        lt: () => query,
        limit: () => query,
        single: async () => ({
          data: { reference: "TEST-REQUEST", client_id: "client-1" },
          error: null,
        }),
        then: (done: (value: unknown) => unknown) =>
          Promise.resolve({ data: [], error: null, payload }).then(done),
      };
      return query;
    },
  };
  return {
    ...actual,
    serviceDb: () => db,
    env: (key: string) =>
      ({
        RESEND_API_KEY: "test-not-a-key",
        EMAIL_FROM: "test@example.com",
        AGENCY_NOTIFICATION_EMAIL: "test@example.com",
      })[key] ?? "test",
  };
});
import { runJobs } from "./jobs";
beforeEach(() => {
  state.send.mockReset();
  state.updates = [];
  state.job.created_at = new Date().toISOString();
  state.job.attempts = 1;
  state.job.provider_id = null;
});
describe("Durable email worker (isolated provider fixtures, no email sent)", () => {
  it("keeps provider rejection retryable without marking delivery successful", async () => {
    state.send.mockResolvedValue({
      error: { message: "rejected" },
      data: null,
    });
    expect(await runJobs()).toEqual({ processed: 0, claimed: 1 });
    expect(state.updates).toContainEqual(
      expect.objectContaining({
        status: "pending",
        last_error: "PROCESSING_FAILED",
      }),
    );
    expect(state.updates.some((v) => v.status === "done")).toBe(false);
  });
  it("reuses the stable provider idempotency key on a retry", async () => {
    state.send.mockResolvedValue({
      data: { id: "provider-test" },
      error: null,
    });
    await runJobs();
    await runJobs();
    expect(state.send).toHaveBeenCalledTimes(2);
    for (const call of state.send.mock.calls)
      expect(call[1]).toEqual({ idempotencyKey: "notify/request-1" });
    expect(state.updates).toContainEqual(
      expect.objectContaining({ provider_id: "provider-test" }),
    );
  });
  it("requires manual review once provider deduplication may have expired", async () => {
    state.job.created_at = new Date(Date.now() - 25 * 3600000).toISOString();
    await runJobs();
    expect(state.send).not.toHaveBeenCalled();
    expect(state.updates).toContainEqual(
      expect.objectContaining({
        status: "unknown",
        last_error: "DELIVERY_REVIEW",
      }),
    );
  });
  it("stops automatic retries after eight failures", async () => {
    state.job.attempts = 8;
    state.send.mockRejectedValue(new Error("unavailable"));
    await runJobs();
    expect(state.updates).toContainEqual(
      expect.objectContaining({ status: "failed" }),
    );
  });
  it("does not resend when provider acceptance was already persisted", async () => {
    state.job.provider_id = "provider-test";
    expect(await runJobs()).toEqual({ processed: 1, claimed: 1 });
    expect(state.send).not.toHaveBeenCalled();
  });
});
