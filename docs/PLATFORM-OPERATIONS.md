# MekWeb Studio — setup and operations

This is a real backend integration. There is no demo database, seeded client data, mock authentication, fake metrics or simulated submission success in the application. Missing integration settings close collection and protected operations instead of pretending to succeed.

## Local development

Use Node.js 24 and `npm ci`. Copy `.env.example` to an ignored `.env.local` and supply development values through your secret manager or local editor, never source control. Run `npm run dev:api` and `npm run dev` in separate terminals. The Vite server proxies `/api` to the actual Node API on 127.0.0.1:8081. Restart the API after changing environment variables.

Generate an independent 32-byte base64 value for SESSION_ENCRYPTION_KEY and independent long random values for RATE_LIMIT_HASH_SECRET and JOB_RUNNER_SECRET. The session cookie is AES-256-GCM encrypted, HttpOnly, SameSite=Lax and Secure in production. No Supabase access/refresh token is returned to the browser JavaScript. Sessions have an eight-hour maximum lifetime; Auth session existence and administrator activity are checked before access. MFA is required in BOTH API authorization and database policies. There is no development authentication bypass.

The local app will let you configure a brief without cloud credentials, but online submission will remain disabled. `/admin/login` will not authenticate anyone without a real Supabase account and the required server configuration.

## Supabase provisioning — a development project first

1. Create or select the correct development Supabase project. Production must be isolated. Confirm region and applicable personal-data transfer obligations before collecting real customer data.
2. Follow `SUPABASE-MIGRATION-REVIEW.md` for the final security review and application procedure. Run the complete `supabase/migrations/20261117202700_quotation_crm_foundation.sql` once as postgres on a fresh project; it now refuses an existing CRM schema or bucket. Run the supplied preflight/postflight SQL. SQL Editor does not track CLI migration history: reconcile the exact successfully applied version with `migration repair` before any future database push. Review and apply the migration using an approved migration process. The CLI in this workspace is 2.98.2; inspect installed CLI help rather than copying commands for CLI v3. No hosted migration has been run by this implementation.
3. New tables use explicit grants and strict RLS. Public visitors have no direct CRM table access or customer-data read API. Privileged business helpers live in the unexposed `crm_private` schema. Do not add that schema to exposed API schemas. Public RPC wrappers are executable only by the intended server or authenticated role.
4. Keep public account signup disabled. Create/invite the initial administrator through Supabase Auth. Add the verified Auth user UUID to `public.admin_profiles` with role `owner` using the database owner connection. Never copy passwords into custom tables. Subsequent owner/admin provisioning and recovery use Supabase administrative controls; there is no public registration or self-promotion endpoint.
5. Configure Auth email/SMTP, redirect URLs and TOTP MFA in Supabase. Sign into `/admin/login` with the administrator account, enroll in TOTP, and verify the code. Store recovery arrangements with the owner. Self-service password recovery is not implemented in the website; the operator must use Supabase administrative recovery controls.
6. Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and server-only SUPABASE_SECRET_KEY. Never use the secret/service-role key in VITE_ variables. Existing legacy anon newsletter settings are unrelated to the new server authorization path.
7. The migration creates the private `crm-documents` bucket (5 MiB per file; PDF/JPEG/PNG). A restrictive policy denies direct anon/authenticated access to this bucket, including when another application has broad storage policies. Downloads are authorized on the backend and receive a 60-second signed link. Storage grants/policies must be verified against the actual hosted project.
8. In `/admin/parametres`, enter only verified legal/fiscal data. ICE/IF/RC/CNSS/address are empty by default. Configure fiscal treatment explicitly; no rate or exemption is presumed. Configure payment/acceptance instructions. Finalization is blocked until these checks are confirmed.
9. Publish a privacy notice that accurately describes this specific operation: controller, purposes, recipients/providers, contact channels, rights, retention and any international transfers. Set an approved retention period. Only then mark the notice verified to open collection. The software does not determine CNDP registration/transfer requirements or certify compliance with Law 09-08. Obtain appropriate professional review.

The public form does not create or sign a quotation. A saved request reference means only that the database transaction committed. Quotations require explicit administrator review and finalization.

## Transactional email

Configure a verified domain in Resend, including the DNS records required by the provider. EMAIL_FROM must belong to that verified sending domain. The existing agency Gmail address may remain the notification recipient; it is not a verified Resend sending identity.

Configure RESEND_API_KEY, EMAIL_FROM and AGENCY_NOTIFICATION_EMAIL. Set RESEND_WEBHOOK_SECRET and route provider events to `POST /api/webhooks/resend`. Verification uses the exact incoming request body and the signature headers. Test this behavior in the actual Vercel runtime before release; a parsed/re-serialized webhook is rejected. Review delivered, bounced and failed events. Provider acceptance is not delivery, and delivery is not a read receipt.

A notification job is inserted in the SAME transaction as the request. Email failure cannot undo a saved request. Jobs use database leases and provider idempotency keys. Provider deduplication is limited to 24 hours; ambiguous sends older than 23 hours require manual review rather than a blind resend. Never change issued document contents to retry email.

## Worker/scheduler

A trusted scheduler must invoke `POST /api/jobs/process` with `Authorization: Bearer <JOB_RUNNER_SECRET>`. Use the same secret from a managed scheduler/Vault, not a public cron URL or committed SQL string. Configure a frequent cadence appropriate to your selected hosting plan. No schedule has been provisioned automatically.

Each invocation claims a bounded batch with SKIP LOCKED, leases it, processes real integrations and records completion/retry/review state. Retry delays increase and stop after eight attempts. The quote page displays the delivery queue and provider events. Monitor failed/unknown jobs and worker invocations. A queue without a running scheduler does not send emails or scan documents.

The worker also queues removal of archived/rejected requests after the owner-approved retention period, cleans expired unattached uploads and removes expired rate-limit buckets. Issued commercial documents are protected by a legal-hold check and require a separately reviewed retention process. Do not disable immutability triggers to erase issued financial records casually. Manual request deletion is owner-only, confirmation-based and queued; file deletion must succeed before database purge. Operational audit logs contain entity IDs/actions and lifecycle metadata, not copied request bodies or private notes.

## Optional supporting documents

Uploads are disabled until MALWARE_SCAN_URL and MALWARE_SCAN_TOKEN are configured. The scanner endpoint must be HTTPS and a trusted processor approved for the data involved. It receives a short-lived signed download URL and SHA-256, authenticated with the configured bearer token, and must return JSON `{ "status": "clean" }` or `{ "status": "infected" }`. Any other response, timeout or provider failure leaves the document unavailable. This integration contract must be tested with the selected scanner; no antivirus service was installed by this change.

The backend verifies declared size/type, the actual downloaded size and file signatures before trusting the scanner result. Files use random object keys in quarantine, cannot overwrite existing objects and are not attached to a saved request until marked clean. Before upload, the customer acknowledges the notice and completes an anti-bot challenge. The final request has its own fresh challenge. The wizard preserves entered values while the customer verifies or removes documents.

## Quotations and PDFs

Draft edits use optimistic revisions. Finalization locks the draft in a transaction, recalculates quantities, discounts and tax in integer centimes, assigns a sequence-based reference and stores an immutable snapshot of agency/client/line/terms data. Rounding is per gross line, then line discount, then tax on the summed net subtotal. JavaScript preview calculations use BigInt and are tested against PostgreSQL.

Changing settings, clients or draft lines does not change an issued version. Revisions retain prior snapshots and document objects. Client acceptance is recorded by an administrator with an evidence note; no public click silently creates a binding acceptance. Acceptance creates a planned project, whose state can be updated separately.

PDFKit renders A4 documents on the server with bundled OFL Noto fonts and the existing MekWeb logo. It was selected after visual pagination QA exposed fixed-element issues in the first React PDF implementation. The discarded renderer dependency is removed. Long text, multi-page tables, repeated branding and page counters are visually checked. The PDF test fixture is marked TEST/NON ÉMIS and is never inserted into the CRM or emailed.

## Vercel release checks

- Node.js 24, existing Vite frontend, one Node function entry point with API rewrites before SPA fallback. Include `server/assets/**` so PDF fonts/logo exist at runtime.
- APP_ORIGIN must exactly match the environment's public origin. Configure staging separately. Avoid permissive wildcard origin matching.
- All administrator endpoints require a verified Auth user, active administrator profile, a live Auth session and AAL2. Mutations additionally require the same origin and CSRF token. The UI redirects on session expiry; UI route protection is not the backend security boundary.
- Upload data goes directly to private Storage, not through the Vercel function payload. Verify signed uploads, scanner callbacks and downloads in staging. Function payload limits still apply to API/PDF responses.
- Configure the scheduler, provider webhook, operational alerts, backups/restore procedures and deletion policy. Confirm plan quotas, function time/memory limits and the scanner's data processing arrangements.
- Security headers restrict scripts/frames and indexing of admin/API routes. The CSP currently allows direct uploads to `*.supabase.co`; update it deliberately if the Supabase project uses a custom storage domain.
- Test a real saved request, replay the same idempotency key, test changed-payload rejection, test a normal signed-in non-admin and an administrator before/after MFA, deactivate an administrator, revoke a session, check cross-origin/CSRF failures, issue/revise a test quote and verify the old PDF is unchanged.
- Force an email/scanner failure in staging and confirm the request remains stored. Confirm duplicate webhook processing does not duplicate events and that `email.sent` is never shown as delivered.
- Migrations precede compatible code deployment. Back up first and review rollback/restore procedures. A rollback of frontend code alone does not reverse schema/data changes.

## Commands and test scope

`npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

The database integration suite runs real PostgreSQL SQL/policy behavior in PGlite, with local stand-ins for Supabase-managed auth/storage metadata. This is not a hosted Supabase Auth/PostgREST/Storage end-to-end test. Native PostgreSQL startup was unavailable in the filesystem/network sandbox. HTTP tests check the actual Node handler's fail-closed behavior without cloud configuration. Wizard tests and browser review verify navigation, preselection, accessibility and configuration-disabled submission. No real customer request, hosted migration, authentication, upload, email delivery or production deployment is claimed as verified without the connected services.
