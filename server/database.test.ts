import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
const db = new PGlite();
const owner = randomUUID(),
  outsider = randomUUID(),
  authSession = randomUUID();
const payload = {
  projectType: "showcase",
  packageId: "essential",
  businessName: "Entreprise de vérification",
  sector: "Services",
  existingWebsite: "",
  businessDescription: "",
  objective: "Présenter les services",
  audience: "",
  budget: "unknown",
  launchDate: "",
  urgency: "discuss",
  priorities: [],
  notes: "",
  fullName: "Test local",
  companyName: "",
  email: "local@example.com",
  phone: "",
  contactMethod: "email",
  city: "Rabat",
  pages: "2-5",
  style: "",
  branding: "unknown",
  content: "unknown",
  languages: ["fr"],
  features: ["contact"],
};
const submit = async (key: string, hash = "one") =>
  (
    await db.query<{ result: { reference: string } }>(
      "select public.crm_submit_request($1,$2,$3::jsonb) result",
      [key, hash, JSON.stringify(payload)],
    )
  ).rows[0].result;
async function asUser(id: string, fn: () => Promise<void>) {
  await db.exec("set role authenticated");
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: id, session_id: authSession, aal: "aal2" }),
  ]);
  try {
    await fn();
  } finally {
    await db.exec("reset role");
  }
}
beforeAll(async () => {
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub'$$;`.replace(
      "select nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub'",
      "select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid",
    ),
  );
  await db.exec(
    `create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}')$$;grant usage on schema auth to authenticated,anon;grant execute on all functions in schema auth to authenticated,anon;create schema storage;create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text);alter table storage.objects enable row level security;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`,
  );
  await db.exec(
    readFileSync(
      new URL(
        "../supabase/migrations/20261117202700_quotation_crm_foundation.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.query("insert into auth.users values($1),($2)", [owner, outsider]);
  await db.query("insert into auth.sessions values($1,$2)", [
    authSession,
    owner,
  ]);
  await db.query(
    "insert into public.admin_profiles(id,role) values($1,'owner')",
    [owner],
  );
});
afterAll(() => db.close());
describe("Real embedded PostgreSQL migration and policy integration (not a hosted Supabase test)", () => {
  it("enables RLS on every CRM table and exposes no privileged function", async () => {
    const rows = (
      await db.query<{ relname: string; relrowsecurity: boolean }>(
        "select relname,relrowsecurity from pg_class join pg_namespace n on n.oid=relnamespace where n.nspname='public' and relkind='r' and relname<>'newsletter_subscribers' ",
      )
    ).rows;
    expect(rows.length).toBe(17);
    expect(rows.every((r) => r.relrowsecurity)).toBe(true);
    expect(
      (
        await db.query(
          "select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef",
        )
      ).rows,
    ).toHaveLength(0);
  });
  it("blocks collection until privacy configuration is verified", async () => {
    await expect(submit(randomUUID())).rejects.toThrow(
      "PRIVACY_NOT_CONFIGURED",
    );
    await db.exec(
      "update public.agency_settings set privacy_verified=true,privacy_notice_version='test-only',privacy_notice='Local integration test notice'",
    );
  });
  it("saves client, brief, requirements and notification atomically", async () => {
    const key = randomUUID(),
      result = await submit(key);
    expect(result.reference).toMatch(/^MW-D-\d{4}-\d{6}$/);
    expect(
      (
        await db.query(
          "select * from public.project_requests where submission_id=$1",
          [key],
        )
      ).rows,
    ).toHaveLength(1);
    expect(
      (await db.query("select * from public.request_requirements")).rows,
    ).toHaveLength(1);
    expect(
      (await db.query("select * from public.background_jobs")).rows,
    ).toHaveLength(1);
  });
  it("deduplicates retries and rejects altered payloads", async () => {
    const key = randomUUID(),
      a = await submit(key),
      b = await submit(key);
    expect(a).toEqual(b);
    await expect(submit(key, "different")).rejects.toThrow(
      "IDEMPOTENCY_CONFLICT",
    );
  });
  it("rolls back client creation when a later database constraint fails", async () => {
    const before = (
      await db.query<{ n: number }>(
        "select count(*)::int n from public.clients",
      )
    ).rows[0].n;
    await expect(
      db.query("select public.crm_submit_request($1,$2,$3::jsonb)", [
        randomUUID(),
        "x",
        JSON.stringify({ ...payload, projectType: "invalid" }),
      ]),
    ).rejects.toThrow();
    expect(
      (
        await db.query<{ n: number }>(
          "select count(*)::int n from public.clients",
        )
      ).rows[0].n,
    ).toBe(before);
  });
  it("denies anonymous reads and privileged RPC execution", async () => {
    await db.exec("set role anon");
    try {
      await expect(db.query("select * from public.clients")).rejects.toThrow(
        "permission denied",
      );
      await expect(
        db.query("select public.crm_submit_request($1,$2,$3)", [
          randomUUID(),
          "h",
          JSON.stringify(payload),
        ]),
      ).rejects.toThrow("permission denied");
    } finally {
      await db.exec("reset role");
    }
  });
  it("hides records from a signed-in non-administrator", async () => {
    await asUser(outsider, async () => {
      expect(
        (await db.query("select * from public.clients")).rows,
      ).toHaveLength(0);
      await expect(
        db.query("select public.crm_save_quote(null,$1::jsonb)", ["{}"]),
      ).rejects.toThrow("FORBIDDEN");
    });
  });
  it("allows active administrators and immediately removes access after deactivation", async () => {
    await asUser(owner, async () => {
      expect(
        (await db.query("select * from public.clients")).rows.length,
      ).toBeGreaterThan(0);
    });
    await db.query(
      "update public.admin_profiles set active=false where id=$1",
      [owner],
    );
    await asUser(owner, async () => {
      expect(
        (await db.query("select * from public.clients")).rows,
      ).toHaveLength(0);
    });
    await db.query("update public.admin_profiles set active=true where id=$1", [
      owner,
    ]);
  });
  it("denies direct Data API-equivalent access before MFA, even for an active administrator", async () => {
    await asUser(owner, async () => {
      await db.query("select set_config('request.jwt.claims',$1,false)", [
        JSON.stringify({ sub: owner, session_id: authSession, aal: "aal1" }),
      ]);
      expect(
        (await db.query("select * from public.clients")).rows,
      ).toHaveLength(0);
      expect(
        (
          await db.query<{ v: boolean }>(
            "select public.crm_admin_session_valid() v",
          )
        ).rows[0].v,
      ).toBe(true);
    });
  });
  it("blocks private Storage reads even when another policy broadly permits reads", async () => {
    await db.exec(
      "grant usage on schema storage to anon,authenticated;grant select on storage.objects to anon,authenticated;create policy test_broad_read on storage.objects for select to anon,authenticated using(true);insert into storage.objects(bucket_id) values('crm-documents'),('other-bucket')",
    );
    await db.exec("set role anon");
    try {
      const rows = (
        await db.query<{ bucket_id: string }>(
          "select bucket_id from storage.objects",
        )
      ).rows;
      expect(rows.map((r) => r.bucket_id)).toEqual(["other-bucket"]);
    } finally {
      await db.exec("reset role");
    }
  });
  it("revokes RLS access when the Supabase auth session no longer exists", async () => {
    await db.query("delete from auth.sessions where id=$1", [authSession]);
    await asUser(owner, async () => {
      expect(
        (await db.query("select * from public.clients")).rows,
      ).toHaveLength(0);
    });
    await db.query("insert into auth.sessions values($1,$2)", [
      authSession,
      owner,
    ]);
  });
  it("creates a quote draft but refuses finalization without verified settings", async () => {
    const client = (
      await db.query<{ id: string }>("select id from public.clients limit 1")
    ).rows[0].id;
    const draft = {
      client_id: client,
      request_id: null,
      title: "Devis de test",
      description: "",
      expires_on: "2099-12-31",
      delivery_estimate: "",
      payment_terms: "Conditions de vérification uniquement",
      notes: "",
      tax_mode: "not_applicable",
      tax_bps: 0,
      tax_note: "Configuration de test uniquement",
      items: [
        {
          description: "Test de calcul",
          quantity: "1.005",
          unit_price_cents: 101,
          discount_bps: 1000,
        },
      ],
      expected_revision: 0,
    };
    await asUser(owner, async () => {
      const id = (
        await db.query<{ id: string }>(
          "select public.crm_save_quote(null,$1::jsonb) id",
          [JSON.stringify(draft)],
        )
      ).rows[0].id;
      await expect(
        db.query("select public.crm_finalize_quote($1,0)", [id]),
      ).rejects.toThrow("SETTINGS_INCOMPLETE");
    });
  });
  it("calculates and freezes issued versions; revisions preserve previous snapshots", async () => {
    await db.exec(
      "update public.agency_settings set legal_verified=true,tax_configured=true,tax_mode='not_applicable',acceptance_instructions='Réponse écrite requise' ",
    );
    const id = (
      await db.query<{ id: string }>("select id from public.quotes limit 1")
    ).rows[0].id;
    await asUser(owner, async () => {
      const version = (
        await db.query<{ id: string }>(
          "select public.crm_finalize_quote($1,0) id",
          [id],
        )
      ).rows[0].id;
      const row = (
        await db.query<{ snapshot: { total_cents: number } }>(
          "select snapshot from public.quote_versions where id=$1",
          [version],
        )
      ).rows[0];
      expect(row.snapshot.total_cents).toBe(92);
      await expect(
        db.query("update public.quote_versions set snapshot='{}' where id=$1", [
          version,
        ]),
      ).rejects.toThrow();
      await db.query(
        "select public.crm_quote_action($1,'revision','Test de révision')",
        [id],
      );
      expect(
        (
          await db.query("select * from public.quote_versions where id=$1", [
            version,
          ])
        ).rows,
      ).toHaveLength(1);
    });
  });
  it("enforces shared database rate limits", async () => {
    expect(
      (
        await db.query<{ v: boolean }>(
          "select public.crm_rate_limit('test-rate',1,60) v",
        )
      ).rows[0].v,
    ).toBe(true);
    expect(
      (
        await db.query<{ v: boolean }>(
          "select public.crm_rate_limit('test-rate',1,60) v",
        )
      ).rows[0].v,
    ).toBe(false);
  });
});
