# Supabase foundation — final security review and application guide

Reviewed 18 November 2026. Target: a NEW Supabase development project, not production. The foundation is still unapplied and uncommitted on `feature/quotation-crm`. No hosted SQL, deployment, commit or push was performed.

## Decision

The corrected foundation is suitable for a controlled first application to a fresh hosted Supabase development project, using the checks below. SQL Editor can execute it as `postgres`, in one complete transaction. This is not a claim that your hosted project has already been tested. Hosted Auth, PostgREST, Storage, signed uploads/downloads and administrator MFA must still be smoke-tested after application.

Use the current corrected file, not an earlier chat attachment or copy. If ANY version was already applied to this project, stop: do not rerun, overwrite history or mark a different file as applied. An existing installation needs a forward hardening migration instead.

## Confirmed issues fixed

1. **Inherited function grants:** prior revokes did not consistently clear direct `service_role` grants on authenticated-only public wrappers. Supabase defaults may grant roles directly as well as through PUBLIC. The migration now resets every created private function and each exact public RPC signature for PUBLIC, anon, authenticated and service_role, then applies one explicit allowlist. Trigger functions get no runtime EXECUTE grants. [Supabase function privilege guidance](https://supabase.com/docs/guides/database/functions).
2. **Table/sequence least privilege:** table revokes now include PUBLIC and service_role before deliberate grants. Service access is SELECT/INSERT/UPDATE/DELETE, not ALL: it no longer receives TRUNCATE, REFERENCES or TRIGGER. All private sequences have runtime grants removed; owner-executed helpers allocate references. PUBLIC table grants were an additional custom-default risk, not a claim that every fresh Supabase project grants tables to PUBLIC. [Supabase default grant model](https://supabase.com/docs/guides/api/securing-your-api).
3. **Existing bucket safety:** `ON CONFLICT DO NOTHING` could silently keep an existing public bucket. A public bucket bypasses read controls for serving objects. The migration now refuses ANY existing `crm-documents` bucket and inserts a new private bucket without conflict suppression. [Private/public bucket behavior](https://supabase.com/docs/guides/storage/buckets/fundamentals).
4. **Direct RPC validation:** SQL NULL could bypass the minimum evidence-note check in quote decisions. NULL/blank notes now fail. Missing or non-array quote items are also rejected explicitly, even when an administrator calls the RPC directly instead of using the API.
5. **Execution safeguards:** fresh-schema and initialized Auth/Storage checks, metadata access checks, Storage RLS check, explicit postgres execution requirement, five-second lock timeout and sixty-second statement timeout. A second execution or bucket collision stops rather than silently accepting a different state. The single BEGIN/COMMIT transaction includes all ACL changes and the PostgREST reload notification.

## Authorization boundaries

PUBLIC means every database role, not just unauthenticated website visitors. Revoking it does not revoke direct grants held by named roles. The final ACL section handles both. It deliberately does not alter project-wide default privileges or unrelated existing objects; future migrations must explicitly restrict newly created functions/tables too.

| Principal | Table access | Function boundary |
|---|---|---|
| PUBLIC / anon | No CRM table privileges; no private-schema usage | No execution of any created CRM routine |
| authenticated before MFA | Own administrator profile only; no customer CRM rows | Own-session boolean for bootstrap. Business routines reject before AAL2 |
| Active administrator with a live own AAL2 session | RLS-limited reads; writes on clients, requests, projects and pricing | Save/finalize/act on quotations; owner check additionally required to queue deletion |
| Owner with AAL2 | Administrator access plus agency-settings updates | Owner-only deletion scheduling; no self-promotion endpoint |
| service_role | Trusted backend CRUD; bypasses RLS | Submission, rate limiting, job claims, purge execution and retention queueing only; no authenticated administrator RPC grants |
| postgres | Trusted migration/operations owner | Owns tables/routines; administrative SQL is outside the customer authorization boundary |

`service_role` remains highly privileged: restricting its RPC allowlist does not make its secret safe to expose. It can still read/write the application tables as the trusted backend. Never place its key in a VITE variable or browser bundle.

All SECURITY DEFINER routines are in `crm_private`, have `search_path=''`, qualify application objects and are owned by postgres. Public wrappers remain SECURITY INVOKER. Administrator helpers check `admin_profiles.active`, ownership of the JWT session ID in `auth.sessions`, and `aal2`; authorization never trusts user-editable metadata. The SQL session claims used in local tests are test fixtures, not a mechanism to grant access in production.

Every CRM table has RLS. Administrator profile SELECT before MFA is intentional so login/enrollment can work; administrators cannot insert/update their profile or grant themselves a role. Other administrators require AAL2 for business access. Agency settings require an owner for writes. Immutable issued versions/events/audit records cannot be updated/deleted through normal application writes. Service-only tables intentionally have no end-user policy; do not add an allow-all policy to silence an advisor notice.

`crm_private` must remain outside the Data API's exposed-schema list. Authenticated USAGE on it lets public wrappers and policies invoke specific allowed helpers; it does not mean it should be exposed as a REST schema.

## Storage review

The new bucket is private, limited to 5 MiB, and accepts only PDF/JPEG/PNG. A restrictive ALL policy on `storage.objects` denies direct anon/authenticated operations on this bucket, even if another permissive object policy broadly allows access. Other buckets are unaffected. Service-role operations and authorized, short-lived signed URLs are intentional exceptions; a signed URL is a bearer capability until it expires. Do not change the bucket to public or add broad bucket-management permissions later.

The migration creates bucket metadata and an object policy; it does not modify ownership of managed Storage tables, insert fake objects, install a scanner or grant end users access to auth.sessions. Managed Auth/Storage metadata is supplied by Supabase. The preflight verifies the metadata required by the helpers; a permission/ownership error must be investigated, not worked around by disabling RLS or changing managed-table owners.

## Exact SQL Editor procedure

### 1. Confirm the development project

Open [Supabase Dashboard](https://supabase.com/dashboard), select your NEW development project and wait for initialization. Confirm the project name and project reference in the dashboard URL. Do not select the project used by the live website. If the project contains existing customer data, CRM tables or a `crm-documents` bucket, stop and review that state first. Keep collection and email workers off throughout setup.

In Data API settings, leave the API enabled with `public` exposed. Do not expose `crm_private` or `auth`. No additional extension is needed: UUID generation uses PostgreSQL's built-in function. This migration does not depend on the separate legacy newsletter SQL file.

### 2. Run the read-only preflight

Open **SQL Editor → New query**. Select the **postgres** database role. Paste the ENTIRE `quotation-crm-preflight.sql` file supplied with this guide and click **Run**.

Expected final result: `PASS: fresh-project prerequisites; the migration has NOT been applied`. This confirms the required managed tables/functions exist, Storage RLS is on, and no application table/RPC/schema/bucket collides. It does not apply anything or verify the project is the intended one; you must check the project name/reference yourself.

If there is an error, stop. Do not drop existing tables or create a public bucket to make it pass.

### 3. Apply the whole corrected migration once

Create another new SQL query. Paste the ENTIRE corrected `20261117202700_quotation_crm_foundation.sql`, from its opening comments and BEGIN through the final COMMIT. Make sure no text is selected: execute the whole query, not a selected fragment. Keep the role **postgres**. Confirm the project name/reference again, then click **Run**.

A successful result should have no SQL errors (the last statement may report success with no rows). A dashboard warning about privilege-changing SQL can be expected because the reviewed file contains REVOKE statements. Review that the pasted text is exactly this file before continuing.

Do not rerun it after success. If the editor times out or disconnects, the outcome is uncertain: run the postflight and inspect whether the CRM schema exists before taking any action. Never guess that it failed and paste it again.

### 4. Run the read-only postflight

In a NEW SQL query as postgres, paste the entire `quotation-crm-postflight.sql` and run it. Any failed assertion stops with a specific error. On a fresh successful installation the script completes without errors and the final result shows:

- `legal_verified = false`
- `tax_configured = false`
- `privacy_verified = false`
- `privacy_notice_version = unpublished`

The same result row includes PASS for grants, RPCs, RLS and private bucket configuration. Successful completion of the entire assertion script without an exception is required; do not run only its final SELECT.

In **Storage**, confirm `crm-documents` exists and is marked **Private**. Do not upload customer files yet. Confirm `crm_private` is absent from Data API exposed schemas. Run the Dashboard's database Security Advisor and review findings. No hosted advisor run is claimed by this local review; backend-only RLS tables intentionally need no public policy.

### 5. Record migration history before any future database push

SQL Editor does NOT automatically add this file to Supabase CLI migration history. Do not manually insert into `supabase_migrations` or run a database push over the already-created objects. Use `migration repair` ONLY after the exact corrected migration fully committed and postflight passed. This changes history, not the database objects. [Migration tracking guidance](https://supabase.com/docs/guides/deployment/database-migrations).

Open Terminal and run:

```bash
cd /Users/younesmekki/Documents/Codex/2026-11-17/understood-i-ll-treat-mekwebagency-as/work/mekweb-audit
supabase --version
```

These commands were verified against installed CLI **2.98.2**. If you have a different major version, check its `--help` before proceeding; CLI v3 changes remote-target flags/defaults. Do not substitute an unqualified command that might target another database. [CLI v3 changes](https://supabase.com/changelog/supabase-cli-v3).

On this checkout there is currently no `supabase/config.toml`. Run `supabase init` once to create it. If you already initialized it, skip init; never use `--force` to overwrite an existing configuration casually. Then:

```bash
supabase login
supabase link --project-ref YOUR_DEV_PROJECT_REF
```

Replace `YOUR_DEV_PROJECT_REF` with the reference of the SAME development project you just used in SQL Editor. Authenticate through Supabase's browser/local prompts and supply the database password only through its prompt, never in chat or a command argument. Confirm the linked reference is correct.

For CLI 2.98.2:

```bash
supabase migration repair 20261117202700 --status applied --linked
supabase migration list --linked
```

Expected: `20261117202700` appears in BOTH Local and Remote columns. `repair` must not be run after failed/partial SQL or against a different project. The version is explicit so no other migration is marked. It creates/updates migration history without rerunning the foundation. [Verified v2.98.2 repair implementation](https://github.com/supabase/cli/blob/v2.98.2/internal/migration/repair/repair.go).

Do not run `supabase db push` in this SQL Editor path. A CLI-first workflow is an alternative that handles tracking, but it must not be combined with manually applying the same foundation. If you cannot complete history repair yet, note the manual application and finish reconciliation before any future migration push. Once tracked/applied, keep this file unchanged and use new forward migrations for later changes.

### 6. Create the initial administrator safely

In **Authentication → Sign In / Providers**, disable public **Allow new users to sign up** and anonymous sign-ins. Keep the Email provider enabled. In **Authentication → Multi-Factor**, enable TOTP enrollment and verification. Do not weaken database policies to AAL1 if a factor is disabled. [Auth configuration](https://supabase.com/docs/guides/auth/general-configuration), [MFA guidance](https://supabase.com/docs/guides/auth/auth-mfa).

In **Authentication → Users → Add user**, use the administrative **Create user** option with your own email and a strong unique password saved in your password manager. Confirm the email through the legitimate confirmation flow, or mark it confirmed only if you have verified ownership yourself. Do not insert credentials directly into auth.users or custom tables. Copy the new user's UUID and check the email is correct. If the UI offers invitation rather than password creation, first configure SMTP and supported password setup/recovery; the website does not implement that invitation callback flow.

In SQL Editor as postgres, replace BOTH placeholders below before running:

```sql
do $onboard$
declare owner_id uuid := 'REPLACE_WITH_AUTH_USER_UUID';
        owner_email text := 'REPLACE_WITH_YOUR_VERIFIED_EMAIL';
begin
 if not exists (
   select 1 from auth.users
   where id = owner_id
     and lower(email) = lower(owner_email)
     and email_confirmed_at is not null
 ) then
   raise exception 'Verified Auth user UUID/email do not match';
 end if;
 insert into public.admin_profiles(id, role, active)
 values (owner_id, 'owner', true);
end $onboard$;
```

This adds a role/profile only; it stores no password and creates no customer data. Verify your UUID appears in `public.admin_profiles` as owner/active. If a profile already exists, stop and inspect it instead of replacing roles blindly.

### 7. Configure and test locally, without deploying

Privately configure `.env.local` using `.env.example`: development Supabase URL, publishable key, server secret key, independent session-encryption/rate-limit/worker secrets and the exact APP_ORIGIN. Never prefix the server secret with VITE_ or share it in chat. Start `npm run dev:api` and `npm run dev` in separate terminals. Open `http://127.0.0.1:8080/admin/login`.

Sign in, enroll your authenticator using the real QR code, and enter a valid six-digit TOTP code. Only then should business CRM pages load. The Supabase dashboard account is separate from the application's Auth user: a dashboard login alone cannot enter MekWeb Studio. Your new Auth owner also cannot read business data before AAL2. Store recovery arrangements securely; recovery/provisioning is operator-managed through Supabase, not a public website feature.

Verify on the actual development services: wrong credentials fail; a normal Auth user without an administrator profile is denied; the owner before MFA has no business access; correct TOTP grants access; inactive admin/revoked session loses access; private documents cannot be fetched anonymously. Deactivate and revoke an administrator's sessions for offboarding. Do not casually delete users referenced by issued quotes.

Do not mark privacy/legal/tax settings verified merely to open the form. Enter and review the real details first. Turnstile, Resend, a scheduler and the scanner (if uploads are wanted) need separate configuration and end-to-end tests. Migration success alone does not activate or verify those services. Keep real customer collection and production deployment off until that review is complete.

## Execution order and rollback

- Sequence: confirm project → preflight → complete foundation → postflight/advisors → history reconciliation → Auth owner/TOTP → local integration tests → approved service/privacy configuration → later separately approved release.
- A statement error before COMMIT aborts the transaction, including tables, grants, bucket metadata and policies. If using a persistent SQL connection after an error, issue `ROLLBACK;` to leave the failed transaction, then inspect the state. Transaction/late-collision rollback is tested locally.
- If the client disconnects near COMMIT, inspect first: the transaction may already have committed. Foundation rerun rejection is a safeguard, not a rollback mechanism.
- After COMMIT, `ROLLBACK;` and `migration repair --status reverted` DO NOT remove objects or undo customer data. History repair is not schema recovery.
- No destructive down migration, DROP CASCADE, hosted reset or Storage-object deletion is provided/executed. After a successful empty development install, recreating a disposable development project can be simpler than selective teardown. Once records exist, use backups and an explicitly reviewed forward corrective migration/restore plan. Do not delete Storage metadata with SQL to delete real files; use Storage APIs and verify physical removal.
- Before eventual production application, verify backups/restore capability for the selected Supabase plan, preserve issued financial/audit records and review any rollback dependency order. A frontend rollback alone does not undo this schema.

## Verification results and limits

- 30 targeted database/security tests passed: existing 14 SQL integration tests plus 16 new review tests.
- Full suite: **61 passed** (9 frontend + 52 server/shared), including actual local HTTP tests after sandbox loopback permission was granted. An initial full run could not bind loopback; the subsequent permitted run passed.
- TypeScript and production build passed. Lint: no errors, seven existing Fast Refresh warnings. Existing Browserslist/React Router notices remain non-failing.
- The new suite executes the supplied preflight and postflight scripts, tests hostile broad default grants, exact 24-function ACLs, 17-table permissions/RLS, AAL1 restrictions, session ownership, owner-only settings, service-only RPC denial, NULL evidence rejection, broad Storage-policy resistance for all object operations, bucket collisions and transaction rollback.
- Database verification uses real embedded PostgreSQL/PGlite with stand-ins for Supabase-managed Auth/Storage metadata. It does not emulate the complete hosted platform, PostgREST API, Storage API, Auth token issuance or real TOTP ceremony. Hosted permissions/runtime behavior and Security Advisor results remain to be checked by the above procedure.

No deployment, commit, Git push, hosted migration, project configuration change or real email was performed during this review.
