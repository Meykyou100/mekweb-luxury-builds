import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
const migration = readFileSync(
  new URL(
    "../supabase/migrations/20261117202700_quotation_crm_foundation.sql",
    import.meta.url,
  ),
  "utf8",
);
const db = new PGlite();
const owner = randomUUID(),
  ordinaryAdmin = randomUUID(),
  stranger = randomUUID(),
  session = randomUUID();
async function bootstrap(target: PGlite) {
  await target.exec(`create role anon;create role authenticated;create role service_role bypassrls;create role public_only;
 create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid);
 create function auth.uid() returns uuid language sql stable as $$select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid$$;
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}')$$;
 grant usage on schema auth to authenticated,anon;grant execute on all functions in schema auth to authenticated,anon;
 create schema storage;create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text);alter table storage.objects enable row level security;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 -- Model hosted legacy defaults plus adversarial custom PUBLIC/global grants.
 alter default privileges in schema public grant all on tables to anon,authenticated,service_role,public;
 alter default privileges grant execute on functions to anon,authenticated,service_role;
 alter default privileges grant all on sequences to anon,authenticated,service_role,public;
 `);
  await target.exec(
    readFileSync(
      new URL("../docs/sql/quotation-crm-preflight.sql", import.meta.url),
      "utf8",
    ),
  );
}
async function role<T>(
  name: string,
  run: () => Promise<T>,
  id = owner,
  aal = "aal2",
) {
  await db.exec(`set role ${name}`);
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: id, session_id: session, aal }),
  ]);
  try {
    return await run();
  } finally {
    await db.exec("reset role");
  }
}
beforeAll(async () => {
  await bootstrap(db);
  await db.exec(migration);
  await db.query("insert into auth.users values($1),($2),($3)", [
    owner,
    ordinaryAdmin,
    stranger,
  ]);
  await db.query("insert into auth.sessions values($1,$2)", [session, owner]);
  await db.query(
    "insert into public.admin_profiles(id,role) values($1,'owner'),($2,'admin')",
    [owner, ordinaryAdmin],
  );
});
afterAll(() => db.close());
describe("Foundation security under broad hosted/default grants", () => {
  it("passes the exact read-only postflight script supplied for SQL Editor", async () => {
    await db.exec(
      readFileSync(
        new URL("../docs/sql/quotation-crm-postflight.sql", import.meta.url),
        "utf8",
      ),
    );
  });

  it("removes direct and PUBLIC EXECUTE grants and grants exactly the RPC allowlist", async () => {
    const rows = (
      await db.query<{
        name: string;
        schema: string;
        anon: boolean;
        auth: boolean;
        service: boolean;
        public_exec: boolean;
      }>(`select p.proname name,n.nspname schema,
  has_function_privilege('anon',p.oid,'EXECUTE') anon,has_function_privilege('authenticated',p.oid,'EXECUTE') auth,
  has_function_privilege('service_role',p.oid,'EXECUTE') service,
  exists(select 1 from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a where a.grantee=0 and a.privilege_type='EXECUTE') public_exec
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='crm_private' or (n.nspname='public' and p.proname like 'crm_%')`)
    ).rows;
    expect(rows).toHaveLength(24);
    const admin = new Set([
      "has_admin_session",
      "is_admin",
      "is_owner",
      "save_quote",
      "finalize_quote",
      "quote_action",
      "schedule_purge",
      "crm_admin_session_valid",
      "crm_save_quote",
      "crm_finalize_quote",
      "crm_quote_action",
      "crm_schedule_purge",
    ]);
    const service = new Set([
      "submit_request",
      "rate_limit",
      "claim_jobs",
      "purge_request",
      "queue_retention",
      "crm_submit_request",
      "crm_rate_limit",
      "crm_claim_jobs",
      "crm_purge_request",
      "crm_queue_retention",
    ]);
    for (const r of rows) {
      expect(r.anon, r.name).toBe(false);
      expect(r.public_exec, r.name).toBe(false);
      expect(r.auth, r.name).toBe(admin.has(r.name));
      expect(r.service, r.name).toBe(service.has(r.name));
    }
  });
  it("pins search_path and keeps definers private, owned by the migration role", async () => {
    const rows = (
      await db.query<{ schema: string; owner: string; config: string[] }>(
        `select n.nspname schema,pg_get_userbyid(p.proowner) owner,p.proconfig config from pg_proc p join pg_namespace n on n.oid=p.pronamespace where p.prosecdef and (n.nspname='crm_private' or n.nspname='public')`,
      )
    ).rows;
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(r.schema).toBe("crm_private");
      expect(r.owner).toBe("postgres");
      expect(r.config).toContain('search_path=""');
    }
  });
  it("removes PUBLIC/anon table grants and excessive service privileges without touching unrelated objects", async () => {
    const rows = (
      await db.query<{
        name: string;
        anon: boolean;
        public_read: boolean;
        auth_truncate: boolean;
        service_truncate: boolean;
        service_select: boolean;
      }>(`select c.relname name,
  has_table_privilege('anon',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') anon,
  has_table_privilege('public_only',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') public_read,
  has_table_privilege('authenticated',c.oid,'TRUNCATE') auth_truncate,has_table_privilege('service_role',c.oid,'TRUNCATE') service_truncate,
  has_table_privilege('service_role',c.oid,'SELECT') service_select from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'`)
    ).rows;
    expect(rows).toHaveLength(17);
    for (const r of rows) {
      expect(r.anon, r.name).toBe(false);
      expect(r.public_read, r.name).toBe(false);
      expect(r.auth_truncate, r.name).toBe(false);
      expect(r.service_truncate, r.name).toBe(false);
      expect(r.service_select, r.name).toBe(true);
    }
    expect(
      (
        await db.query<{ v: boolean }>(
          "select has_schema_privilege('anon','crm_private','USAGE') v",
        )
      ).rows[0].v,
    ).toBe(false);
    const seq = (
      await db.query<{ v: boolean }>(
        "select has_sequence_privilege('authenticated',oid,'USAGE,SELECT,UPDATE') v from pg_class where relnamespace='crm_private'::regnamespace and relkind='S'",
      )
    ).rows;
    expect(seq).toHaveLength(2);
    expect(seq.every((r) => !r.v)).toBe(true);
  });
  it("denies actual service-only RPC and helper calls to authenticated administrators", async () => {
    await role("authenticated", async () => {
      for (const sql of [
        "select public.crm_submit_request(null,null,null)",
        "select crm_private.submit_request(null,null,null,null,null)",
        "select public.crm_rate_limit('x',1,60)",
        "select public.crm_claim_jobs(1)",
        "select public.crm_purge_request(null)",
        "select public.crm_queue_retention()",
      ]) {
        await expect(db.exec(sql)).rejects.toThrow("permission denied");
      }
    });
  });
  it("does not let the service role impersonate an administrator through an admin RPC", async () => {
    await role("service_role", async () => {
      await expect(
        db.exec("select public.crm_save_quote(null,'{}')"),
      ).rejects.toThrow("permission denied");
    });
  });
  it("permits only the own-profile/bootstrap boolean before MFA, not CRM reads or actions", async () => {
    await role(
      "authenticated",
      async () => {
        expect(
          (await db.query("select * from public.admin_profiles")).rows,
        ).toHaveLength(1);
        expect(
          (
            await db.query<{ v: boolean }>(
              "select public.crm_admin_session_valid() v",
            )
          ).rows[0].v,
        ).toBe(true);
        expect(
          (await db.query("select * from public.agency_settings")).rows,
        ).toHaveLength(0);
        for (const sql of [
          "select public.crm_save_quote(null,'{}')",
          "select public.crm_finalize_quote(null,0)",
          "select public.crm_quote_action(null,'accepted','test')",
          "select public.crm_schedule_purge(null)",
        ]) {
          await expect(db.exec(sql)).rejects.toThrow("FORBIDDEN");
        }
        await expect(
          db.exec("update public.admin_profiles set role='owner'"),
        ).rejects.toThrow("permission denied");
      },
      owner,
      "aal1",
    );
  });
  it("checks session ownership, not merely the presence of a session id", async () => {
    await role(
      "authenticated",
      async () => {
        expect(
          (
            await db.query<{ v: boolean }>(
              "select public.crm_admin_session_valid() v",
            )
          ).rows[0].v,
        ).toBe(false);
        expect(
          (await db.query("select * from public.agency_settings")).rows,
        ).toHaveLength(0);
      },
      ordinaryAdmin,
    );
  });
  it("blocks an ordinary active AAL2 administrator from changing owner settings", async () => {
    const sid = randomUUID();
    await db.query("insert into auth.sessions values($1,$2)", [
      sid,
      ordinaryAdmin,
    ]);
    await role(
      "authenticated",
      async () => {
        await db.query("select set_config('request.jwt.claims',$1,false)", [
          JSON.stringify({ sub: ordinaryAdmin, session_id: sid, aal: "aal2" }),
        ]);
        expect(
          (await db.query("select * from public.agency_settings")).rows,
        ).toHaveLength(1);
        expect(
          (
            await db.query(
              "update public.agency_settings set privacy_verified=true returning id",
            )
          ).rows,
        ).toHaveLength(0);
      },
      ordinaryAdmin,
    );
  });
  it("requires evidence even if an authorized caller bypasses the API and supplies SQL NULL", async () => {
    const client = (
      await db.query<{ id: string }>(
        "insert into public.clients(full_name,email) values('Local security test','local@example.com') returning id",
      )
    ).rows[0].id;
    const quote = (
      await db.query<{ id: string }>(
        "insert into public.quotes(client_id,title,expires_on,payment_terms,status) values($1,'Test',current_date+1,'Test','finalized') returning id",
        [client],
      )
    ).rows[0].id;
    await role("authenticated", async () => {
      await expect(
        db.query("select public.crm_quote_action($1,'accepted',null)", [quote]),
      ).rejects.toThrow("EVIDENCE_REQUIRED");
    });
    expect(
      (
        await db.query<{ status: string }>(
          "select status from public.quotes where id=$1",
          [quote],
        )
      ).rows[0].status,
    ).toBe("finalized");
  });
  it("creates a genuinely private bucket with enforced limits", async () => {
    const r = (
      await db.query<{
        public: boolean;
        file_size_limit: number;
        allowed_mime_types: string[];
      }>("select * from storage.buckets where id='crm-documents'")
    ).rows[0];
    expect(r.public).toBe(false);
    expect(Number(r.file_size_limit)).toBe(5242880);
    expect(r.allowed_mime_types).toEqual([
      "application/pdf",
      "image/jpeg",
      "image/png",
    ]);
  });
  it("blocks all direct object operations despite broad permissive policies, but preserves other buckets", async () => {
    await db.exec(
      "grant usage on schema storage to anon,authenticated,service_role;grant all on storage.objects to anon,authenticated,service_role;create policy broad_test on storage.objects for all to anon,authenticated using(true) with check(true);insert into storage.objects(bucket_id) values('crm-documents'),('other-bucket')",
    );
    for (const r of ["anon", "authenticated"])
      await role(r, async () => {
        expect(
          (
            await db.query<{ bucket_id: string }>(
              "select * from storage.objects",
            )
          ).rows.map((r) => r.bucket_id),
        ).toEqual(["other-bucket"]);
        await expect(
          db.exec(
            "insert into storage.objects(bucket_id) values('crm-documents')",
          ),
        ).rejects.toThrow("row-level security");
        expect(
          (
            await db.query(
              "update storage.objects set bucket_id='crm-documents' where bucket_id='crm-documents' returning id",
            )
          ).rows,
        ).toHaveLength(0);
        expect(
          (
            await db.query(
              "delete from storage.objects where bucket_id='crm-documents' returning id",
            )
          ).rows,
        ).toHaveLength(0);
        await expect(
          db.exec(
            "update storage.objects set bucket_id='crm-documents' where bucket_id='other-bucket'",
          ),
        ).rejects.toThrow("row-level security");
      });
    await role("service_role", async () => {
      expect(
        (
          await db.query(
            "select * from storage.objects where bucket_id='crm-documents'",
          )
        ).rows,
      ).toHaveLength(1);
    });
  });
  it("rejects a second execution without changing the existing foundation", async () => {
    await expect(db.exec(migration)).rejects.toThrow("CRM_ALREADY_EXISTS");
    await db.exec("rollback");
    expect(
      (await db.query("select * from public.agency_settings")).rows,
    ).toHaveLength(1);
  });
});
describe("Fresh-project preflight and atomic rollback", () => {
  it.each([false, true])(
    "rejects an existing bucket (public=%s) without adopting or changing it",
    async (isPublic) => {
      const other = new PGlite();
      try {
        await bootstrap(other);
        await other.query(
          "insert into storage.buckets(id,name,public) values('crm-documents','Existing',$1)",
          [isPublic],
        );
        await expect(other.exec(migration)).rejects.toThrow(
          "BUCKET_ALREADY_EXISTS",
        );
        await other.exec("rollback");
        expect(
          (
            await other.query<{ public: boolean }>(
              "select public from storage.buckets where id='crm-documents'",
            )
          ).rows[0].public,
        ).toBe(isPublic);
        expect(
          (
            await other.query<{ v: string | null }>(
              "select to_regnamespace('crm_private')::text v",
            )
          ).rows[0].v,
        ).toBe(null);
      } finally {
        await other.close();
      }
    },
  );
  it("rolls back earlier DDL if a later application-table collision is found", async () => {
    const other = new PGlite();
    try {
      await bootstrap(other);
      await other.exec("create table public.projects(marker text)");
      await expect(other.exec(migration)).rejects.toThrow("already exists");
      await other.exec("rollback");
      expect(
        (
          await other.query<{ v: string | null }>(
            "select to_regclass('public.clients')::text v",
          )
        ).rows[0].v,
      ).toBe(null);
      expect(
        (
          await other.query<{ v: string | null }>(
            "select to_regnamespace('crm_private')::text v",
          )
        ).rows[0].v,
      ).toBe(null);
      expect(
        (await other.query("select * from public.projects")).rows,
      ).toHaveLength(0);
    } finally {
      await other.close();
    }
  });
});
