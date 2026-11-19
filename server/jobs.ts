import { Resend } from "resend";
import { env, dbError, hash, HttpError, serviceDb } from "./core.js";
import type { Job, Version } from "./models.js";
import { issuedPdf } from "./pdf.js";
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function validMagic(bytes: Buffer, mime: string) {
  return mime === "application/pdf"
    ? bytes.subarray(0, 5).toString() === "%PDF-"
    : mime === "image/png"
      ? bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : mime === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : false;
}
async function processScan(job: Job) {
  const db = serviceDb(),
    d = await db.from("documents").select("*").eq("id", job.entity_id).single();
  dbError(d.error);
  const doc = d.data;
  if (doc.scan_status === "clean" || doc.scan_status === "infected") return;
  const download = await db.storage
    .from("crm-documents")
    .download(doc.object_path);
  if (download.error) throw new Error("STORAGE_DOWNLOAD");
  const bytes = Buffer.from(await download.data.arrayBuffer());
  if (
    bytes.length !== doc.size_bytes ||
    bytes.length > 5242880 ||
    !validMagic(bytes, doc.mime_type)
  ) {
    await db
      .from("documents")
      .update({ scan_status: "infected" })
      .eq("id", doc.id);
    return;
  }
  const link = await db.storage
    .from("crm-documents")
    .createSignedUrl(doc.object_path, 120);
  if (link.error) throw new Error("STORAGE_SIGN");
  const response = await fetch(env("MALWARE_SCAN_URL"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env("MALWARE_SCAN_TOKEN")}`,
    },
    body: JSON.stringify({ url: link.data.signedUrl, sha256: hash(bytes) }),
    signal: AbortSignal.timeout(20000),
  });
  const result = (await response.json()) as { status?: string };
  if (!response.ok || !["clean", "infected"].includes(result.status ?? ""))
    throw new Error("SCANNER_UNAVAILABLE");
  dbError(
    (
      await db
        .from("documents")
        .update({ scan_status: result.status, sha256: hash(bytes) })
        .eq("id", doc.id)
    ).error,
  );
}
async function send(job: Job) {
  if (job.provider_id) {
    await reconcile(job);
    return;
  }
  // Provider deduplication expires after 24 hours: an old ambiguous send requires review.
  if (Date.now() - Date.parse(job.created_at) > 23 * 3600000)
    throw new HttpError(
      409,
      "DELIVERY_REVIEW",
      "Vérification manuelle requise avant un nouvel envoi.",
    );
  const db = serviceDb();
  let to: string,
    subject: string,
    html: string,
    attachments: { filename: string; content: Buffer }[] | undefined;
  if (job.kind === "quote_email") {
    const row = await db
      .from("quote_versions")
      .select("*")
      .eq("id", job.entity_id)
      .single();
    dbError(row.error);
    const version = row.data as Version;
    const quote = await db
      .from("quotes")
      .select("current_version_id,status")
      .eq("id", version.quote_id)
      .single();
    dbError(quote.error);
    if (
      quote.data?.current_version_id !== version.id ||
      !["finalized", "sent"].includes(quote.data.status)
    )
      throw new HttpError(
        409,
        "STALE_QUOTE",
        "Version remplacée ou devis non envoyable.",
      );
    if (Date.parse(version.snapshot.expires_on + "T23:59:59Z") < Date.now())
      throw new HttpError(409, "EXPIRED_QUOTE", "Devis expiré.");
    const pdf = await issuedPdf(version),
      file = await db.storage.from("crm-documents").download(pdf.path);
    if (file.error) throw new Error("PDF_DOWNLOAD");
    to = version.snapshot.client.email;
    subject = `Votre devis MekWeb — ${version.snapshot.reference}`;
    html = `<p>Bonjour ${escape(version.snapshot.client.full_name)},</p><p>Veuillez trouver votre devis ${escape(version.snapshot.reference)}, révision ${version.version}, en pièce jointe.</p><p>${escape(version.snapshot.agency.acceptance_instructions).replace(/\n/g, "<br>")}</p><p>MekWeb Agency</p>`;
    attachments = [
      {
        filename: pdf.filename,
        content: Buffer.from(await file.data.arrayBuffer()),
      },
    ];
  } else {
    const req = await db
      .from("project_requests")
      .select("reference,client_id")
      .eq("id", job.entity_id)
      .single();
    dbError(req.error);
    if (job.kind === "agency_notification") {
      to = env("AGENCY_NOTIFICATION_EMAIL");
      subject = `Nouvelle demande — ${req.data!.reference}`;
      html = `<p>Une nouvelle demande ${escape(req.data!.reference)} a été enregistrée.</p><p>Connectez-vous à MekWeb Studio pour consulter le brief.</p>`;
    } else {
      const client = await db
        .from("clients")
        .select("email")
        .eq("id", req.data!.client_id)
        .single();
      dbError(client.error);
      to = client.data!.email;
      subject = `Votre demande MekWeb — ${req.data!.reference}`;
      html = `<p>Votre demande a bien été enregistrée sous la référence ${escape(req.data!.reference)}.</p><p>Il s’agit d’une demande d’étude, sans devis ni engagement commercial automatique.</p><p>MekWeb Agency</p>`;
    }
  }
  const result = await new Resend(env("RESEND_API_KEY")).emails.send(
    {
      from: env("EMAIL_FROM"),
      to,
      subject,
      html,
      ...(attachments ? { attachments } : {}),
    },
    { idempotencyKey: job.dedupe_key },
  );
  if (result.error || !result.data) throw new Error("EMAIL_PROVIDER_REJECTED");
  dbError(
    (
      await db
        .from("background_jobs")
        .update({ provider_id: result.data.id })
        .eq("id", job.id)
    ).error,
  );
  await reconcile(job);
}
async function reconcile(job: Job) {
  if (job.kind !== "quote_email") return;
  const db = serviceDb(),
    v = await db
      .from("quote_versions")
      .select("quote_id")
      .eq("id", job.entity_id)
      .single();
  dbError(v.error);
  dbError(
    (
      await db
        .from("quotes")
        .update({ status: "sent" })
        .eq("id", v.data!.quote_id)
        .eq("current_version_id", job.entity_id)
        .eq("status", "finalized")
    ).error,
  );
  dbError(
    (
      await db
        .from("quote_events")
        .upsert(
          {
            quote_id: v.data!.quote_id,
            version_id: job.entity_id,
            event_type: "email_accepted",
            dedupe_key: `accepted/${job.id}`,
            detail:
              "Accepté par le prestataire, livraison non encore confirmée.",
          },
          { onConflict: "dedupe_key", ignoreDuplicates: true },
        )
    ).error,
  );
}
async function purge(job: Job) {
  const db = serviceDb();
  const target = await db
    .from("project_requests")
    .select("id,client_id,deletion_requested_at")
    .eq("id", job.entity_id)
    .maybeSingle();
  dbError(target.error);
  if (!target.data) return;
  const versions = await db
    .from("quotes")
    .select("id")
    .eq("client_id", target.data.client_id)
    .not("reference", "is", null);
  dbError(versions.error);
  if (versions.data?.length)
    throw new HttpError(
      409,
      "LEGAL_HOLD",
      "Dossier commercial émis : examen de conservation requis.",
    );
  const docs = await db
    .from("documents")
    .select("id,object_path")
    .eq("request_id", job.entity_id);
  dbError(docs.error);
  if (docs.data?.length) {
    const remove = await db.storage
      .from("crm-documents")
      .remove(docs.data.map((d) => d.object_path));
    if (remove.error) throw new Error("STORAGE_DELETE");
  }
  dbError((await db.rpc("crm_purge_request", { p_id: job.entity_id })).error);
}
export async function runJobs() {
  const db = serviceDb();
  dbError((await db.rpc("crm_queue_retention")).error);
  await cleanOrphans();
  const claim = await db.rpc("crm_claim_jobs", { p_limit: 3 });
  dbError(claim.error);
  let processed = 0;
  for (const job of claim.data as Job[]) {
    try {
      if (job.kind === "scan") await processScan(job);
      else if (job.kind === "purge") await purge(job);
      else await send(job);
      dbError(
        (
          await db
            .from("background_jobs")
            .update({
              status: "done",
              lease_until: null,
              last_error: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", job.id)
        ).error,
      );
      processed++;
    } catch (error) {
      const review = error instanceof HttpError && error.status === 409;
      await db
        .from("background_jobs")
        .update({
          status: review ? "unknown" : job.attempts >= 8 ? "failed" : "pending",
          available_at: new Date(
            Date.now() + Math.min(3600000, 2 ** job.attempts * 30000),
          ).toISOString(),
          lease_until: null,
          last_error: review ? (error as HttpError).code : "PROCESSING_FAILED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }
  }
  return { processed, claimed: claim.data.length };
}

async function cleanOrphans() {
  const db = serviceDb(),
    sessions = await db
      .from("submission_sessions")
      .select("id")
      .is("request_id", null)
      .lt("expires_at", new Date().toISOString())
      .limit(25);
  dbError(sessions.error);
  for (const session of sessions.data ?? []) {
    const docs = await db
      .from("documents")
      .select("id,object_path")
      .eq("submission_id", session.id)
      .is("request_id", null);
    dbError(docs.error);
    if (docs.data?.length) {
      const result = await db.storage
        .from("crm-documents")
        .remove(docs.data.map((d) => d.object_path));
      if (result.error) continue;
      dbError(
        (
          await db
            .from("documents")
            .delete()
            .eq("submission_id", session.id)
            .is("request_id", null)
        ).error,
      );
      await db
        .from("background_jobs")
        .update({ status: "done", last_error: "DATA_DELETED" })
        .eq("kind", "scan")
        .in(
          "entity_id",
          docs.data.map((d) => d.id),
        );
    }
    dbError(
      (
        await db
          .from("submission_sessions")
          .delete()
          .eq("id", session.id)
          .is("request_id", null)
      ).error,
    );
  }
  dbError(
    (
      await db
        .from("rate_limit_buckets")
        .delete()
        .lt("expires_at", new Date().toISOString())
    ).error,
  );
}
