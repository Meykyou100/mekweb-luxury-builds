import { randomBytes, randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Resend } from "resend";
import { z, ZodError } from "zod";
import {
  submitSchema,
  normalizePhone,
  requestUpdateSchema,
  clientUpdateSchema,
  quoteDraftSchema,
  agencySchema,
  pricingSchema,
} from "../shared/schemas";
import {
  admin,
  body,
  checkOrigin,
  dbError,
  env,
  hash,
  HttpError,
  json,
  rateLimit,
  rawBody,
  safeEqual,
  serviceDb,
  verifyChallenge,
} from "./core";
import { authRoute } from "./auth";
import { runJobs } from "./jobs";
import { draftSnapshot, issuedPdf, renderQuote } from "./pdf";
import type { Version } from "./models";
const uuid = z.string().uuid();
const tables = {
  requests: "project_requests",
  clients: "clients",
  quotes: "quotes",
  projects: "projects",
  pricing: "pricing_catalog",
} as const;
export async function handler(req: IncomingMessage, res: ServerResponse) {
  const requestId = randomUUID();
  res.setHeader("X-Request-Id", requestId);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  try {
    const url = new URL(req.url ?? "/", env("APP_ORIGIN")),
      path = (
        url.searchParams.get("route") ?? url.pathname.replace(/^\/api\/?/, "")
      ).replace(/^\/+|\/+$/g, "");
    if (path === "public/config" && req.method === "GET") {
      try {
        const r = await serviceDb()
          .from("agency_settings")
          .select(
            "name,email,phone,city,privacy_notice,privacy_notice_version,privacy_verified",
          )
          .single();
        dbError(r.error);
        if (!r.data) throw new Error("CONFIG_UNAVAILABLE");
        return json(res, 200, {
          requestsEnabled: Boolean(
            r.data.privacy_verified &&
            r.data.privacy_notice_version !== "unpublished" &&
            process.env.TURNSTILE_SECRET_KEY,
          ),
          uploadsEnabled: Boolean(
            process.env.MALWARE_SCAN_URL && process.env.MALWARE_SCAN_TOKEN,
          ),
          agency: r.data,
        });
      } catch {
        return json(res, 200, {
          requestsEnabled: false,
          uploadsEnabled: false,
          agency: null,
        });
      }
    }
    if (path === "project-requests" && req.method === "POST") {
      checkOrigin(req);
      await rateLimit(req, "request", 6, 3600);
      const value = await body(req, submitSchema);
      await verifyChallenge(value.challengeToken);
      const payload = {
        ...value.request,
        email: value.request.email.toLowerCase(),
        phone: value.request.phone ? normalizePhone(value.request.phone) : "",
      };
      const r = await serviceDb().rpc("crm_submit_request", {
        p_key: value.idempotencyKey,
        p_hash: hash(
          JSON.stringify({ payload, documents: [...value.documentIds].sort() }),
        ),
        p_payload: payload,
        p_documents: value.documentIds,
        p_cap: value.uploadSession ? hash(value.uploadSession) : null,
      });
      dbError(r.error);
      return json(res, 201, r.data);
    }
    if (path.startsWith("auth/")) return await authRoute(path, req, res);
    if (path === "uploads/tickets" && req.method === "POST") {
      checkOrigin(req);
      if (!process.env.MALWARE_SCAN_URL || !process.env.MALWARE_SCAN_TOKEN)
        throw new HttpError(
          503,
          "UPLOADS_DISABLED",
          "Les pièces jointes ne sont pas encore disponibles.",
        );
      await rateLimit(req, "uploads", 5, 3600);
      const v = await body(
        req,
        z
          .object({
            idempotencyKey: uuid,
            challengeToken: z.string().min(1),
            consent: z.literal(true),
            files: z
              .array(
                z
                  .object({
                    name: z.string().min(1).max(150),
                    size: z.number().int().min(1).max(5242880),
                    type: z.enum([
                      "application/pdf",
                      "image/jpeg",
                      "image/png",
                    ]),
                  })
                  .strict(),
              )
              .min(1)
              .max(3),
          })
          .strict(),
      );
      await verifyChallenge(v.challengeToken);
      const configuration = await serviceDb()
        .from("agency_settings")
        .select("privacy_verified")
        .single();
      if (!configuration.data?.privacy_verified)
        throw new HttpError(503, "PRIVACY", "La collecte n’est pas ouverte.");
      const db = serviceDb(),
        cap = randomBytes(32).toString("base64url");
      const session = await db
        .from("submission_sessions")
        .insert({ id: v.idempotencyKey, capability_hash: hash(cap) });
      if (session.error)
        throw new HttpError(
          409,
          "UPLOAD_SESSION",
          "Une session existe déjà. Retirez les pièces jointes avant de recommencer.",
        );
      const tickets = [];
      for (const f of v.files) {
        const id = randomUUID(),
          path = `quarantine/${v.idempotencyKey}/${id}`;
        const filename = f.name.replace(/[^\p{L}\p{N} ._-]/gu, "_");
        const doc = await db
          .from("documents")
          .insert({
            id,
            submission_id: v.idempotencyKey,
            object_path: path,
            filename,
            mime_type: f.type,
            size_bytes: f.size,
          });
        dbError(doc.error);
        const signed = await db.storage
          .from("crm-documents")
          .createSignedUploadUrl(path, { upsert: false });
        if (signed.error)
          throw new HttpError(
            502,
            "UPLOAD",
            "Le transfert n’a pas pu être préparé.",
          );
        tickets.push({ id, url: signed.data.signedUrl });
      }
      return json(res, 201, { capability: cap, tickets });
    }
    if (path === "uploads/complete" && req.method === "POST") {
      checkOrigin(req);
      await rateLimit(req, "upload-status", 120, 3600);
      const v = await body(
        req,
        z
          .object({
            idempotencyKey: uuid,
            capability: z.string().min(30).max(200),
          })
          .strict(),
      );
      const db = serviceDb();
      const s = await db
        .from("submission_sessions")
        .select("*")
        .eq("id", v.idempotencyKey)
        .single();
      if (
        s.error ||
        !s.data.capability_hash ||
        !safeEqual(s.data.capability_hash, hash(v.capability)) ||
        Date.parse(s.data.expires_at) < Date.now()
      )
        throw new HttpError(
          403,
          "UPLOAD_SESSION",
          "Session de documents invalide ou expirée.",
        );
      const docs = await db
        .from("documents")
        .select("id,scan_status")
        .eq("submission_id", v.idempotencyKey);
      dbError(docs.error);
      for (const d of docs.data ?? [])
        if (d.scan_status === "pending")
          dbError(
            (
              await db
                .from("background_jobs")
                .upsert(
                  { kind: "scan", entity_id: d.id, dedupe_key: `scan/${d.id}` },
                  { onConflict: "dedupe_key", ignoreDuplicates: true },
                )
            ).error,
          );
      return json(res, 200, { documents: docs.data });
    }
    if (path === "jobs/process" && req.method === "POST") {
      if (
        !safeEqual(
          String(req.headers.authorization ?? ""),
          `Bearer ${env("JOB_RUNNER_SECRET")}`,
        )
      )
        throw new HttpError(401, "UNAUTHENTICATED", "Accès non autorisé.");
      return json(res, 200, await runJobs());
    }
    if (path === "webhooks/resend" && req.method === "POST") {
      // Must verify the exact incoming bytes, never JSON.stringify a parsed webhook.
      const raw = await rawBody(req, 250000, true),
        provider = new Resend(env("RESEND_API_KEY"));
      let event;
      try {
        event = provider.webhooks.verify({
          payload: raw,
          headers: {
            id: String(req.headers["svix-id"] ?? ""),
            timestamp: String(req.headers["svix-timestamp"] ?? ""),
            signature: String(req.headers["svix-signature"] ?? ""),
          },
          webhookSecret: env("RESEND_WEBHOOK_SECRET"),
        });
      } catch {
        throw new HttpError(401, "WEBHOOK_SIGNATURE", "Signature invalide.");
      }
      const data = event as {
        type: string;
        created_at: string;
        data: { email_id?: string };
      };
      const db = serviceDb();
      const job = await db
        .from("background_jobs")
        .select("id,entity_id,kind")
        .eq("provider_id", data.data.email_id ?? "")
        .maybeSingle();
      dbError(job.error);
      // A webhook may beat the send response; ask the provider to retry rather than lose it.
      if (!job.data)
        throw new HttpError(503, "WEBHOOK_RETRY", "Événement à retraiter.");
      const insert = await db
        .from("delivery_events")
        .upsert(
          {
            job_id: job.data.id,
            provider_event_id: String(req.headers["svix-id"]),
            event_type: data.type,
            occurred_at: data.created_at,
          },
          { onConflict: "provider_event_id", ignoreDuplicates: true },
        );
      dbError(insert.error);
      return json(res, 200, { received: true });
    }
    if (!path.startsWith("admin/"))
      throw new HttpError(404, "NOT_FOUND", "Route introuvable.");
    const who = await admin(req, res),
      db = who.db,
      parts = path.split("/"),
      section = parts[1],
      id = parts[2],
      action = parts[3];
    if (id) uuid.parse(id);
    if (section === "overview" && req.method === "GET") {
      const queries = [
        db
          .from("project_requests")
          .select("id", { head: true, count: "exact" })
          .eq("status", "new"),
        db
          .from("project_requests")
          .select("id", { head: true, count: "exact" })
          .eq("status", "under_review"),
        db
          .from("quotes")
          .select("id", { head: true, count: "exact" })
          .eq("status", "draft"),
        db
          .from("quotes")
          .select("id", { head: true, count: "exact" })
          .eq("status", "sent"),
        db
          .from("quotes")
          .select("id", { head: true, count: "exact" })
          .eq("status", "accepted"),
        db
          .from("projects")
          .select("id", { head: true, count: "exact" })
          .eq("status", "active"),
      ];
      const r = await Promise.all(queries);
      r.forEach((x) => dbError(x.error));
      return json(res, 200, { counts: r.map((x) => x.count ?? 0) });
    }
    if (section === "settings") {
      if (req.method === "GET") {
        const r = await db.from("agency_settings").select("*").single();
        dbError(r.error);
        return json(res, 200, r.data);
      }
      if (req.method === "PATCH") {
        if (who.role !== "owner")
          throw new HttpError(
            403,
            "FORBIDDEN",
            "Cette configuration est réservée au propriétaire.",
          );
        const v = await body(req, agencySchema);
        if (v.tax_mode !== "standard" && v.tax_bps !== 0)
          throw new HttpError(422, "TAX", "Vérifiez le traitement fiscal.");
        if (
          v.privacy_verified &&
          (!v.retention_days || v.privacy_notice.trim().length < 100)
        )
          throw new HttpError(
            422,
            "PRIVACY",
            "Renseignez une notice complète avant validation.",
          );
        const r = await db
          .from("agency_settings")
          .update({
            ...v,
            privacy_notice_version: v.privacy_verified
              ? new Date().toISOString()
              : "unpublished",
          })
          .eq("singleton", true)
          .select()
          .single();
        dbError(r.error);
        return json(res, 200, r.data);
      }
    }
    if (section === "documents" && id && req.method === "GET") {
      const doc = await db
        .from("documents")
        .select("object_path,filename,scan_status")
        .eq("id", id)
        .single();
      dbError(doc.error);
      if (!doc.data)
        throw new HttpError(404, "NOT_FOUND", "Document introuvable.");
      if (doc.data.scan_status !== "clean")
        throw new HttpError(
          409,
          "DOCUMENT_NOT_READY",
          "Le document n’est pas disponible.",
        );
      const link = await serviceDb()
        .storage.from("crm-documents")
        .createSignedUrl(doc.data.object_path, 60, {
          download: doc.data.filename,
        });
      if (link.error)
        throw new HttpError(502, "DOCUMENT", "Document indisponible.");
      return json(res, 200, { url: link.data.signedUrl });
    }
    const table = tables[section as keyof typeof tables];
    if (!table) throw new HttpError(404, "NOT_FOUND", "Route introuvable.");
    if (req.method === "GET" && !id) {
      let q = db
        .from(table)
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });
      const page = Math.max(
        0,
        Math.min(10000, Number(url.searchParams.get("page")) || 0),
      );
      const search = (url.searchParams.get("search") ?? "")
        .slice(0, 100)
        .replace(/[\\%_]/g, "");
      const field =
        section === "requests"
          ? "business_name"
          : section === "clients"
            ? "full_name"
            : section === "pricing"
              ? "name"
              : "title";
      if (search) q = q.ilike(field, `%${search}%`);
      const status = url.searchParams.get("status");
      if (status && ["requests", "quotes", "projects"].includes(section))
        q = q.eq("status", status);
      const client = url.searchParams.get("client");
      if (client && ["requests", "quotes", "projects"].includes(section))
        q = q.eq("client_id", uuid.parse(client));
      const r = await q.range(page * 25, page * 25 + 24);
      dbError(r.error);
      return json(res, 200, { items: r.data, total: r.count, page });
    }
    if (req.method === "GET" && id) {
      const r = await db.from(table).select("*").eq("id", id).single();
      dbError(r.error);
      let related: Record<string, unknown> = {};
      if (section === "requests") {
        const [client, requirements, documents] = await Promise.all([
          db.from("clients").select("*").eq("id", r.data.client_id).single(),
          db
            .from("request_requirements")
            .select("*")
            .eq("request_id", id)
            .single(),
          db
            .from("documents")
            .select("id,filename,scan_status")
            .eq("request_id", id),
        ]);
        [client, requirements, documents].forEach((x) => dbError(x.error));
        related = {
          client: client.data,
          requirements: requirements.data,
          documents: documents.data,
        };
      }
      if (section === "quotes") {
        const [client, items, versions, events] = await Promise.all([
          db.from("clients").select("*").eq("id", r.data.client_id).single(),
          db
            .from("quote_items")
            .select("*")
            .eq("quote_id", id)
            .order("position"),
          db
            .from("quote_versions")
            .select("*")
            .eq("quote_id", id)
            .order("version", { ascending: false }),
          db
            .from("quote_events")
            .select("*")
            .eq("quote_id", id)
            .order("created_at", { ascending: false }),
        ]);
        [client, items, versions, events].forEach((x) => dbError(x.error));
        related = {
          client: client.data,
          items: items.data,
          versions: versions.data,
          events: events.data,
        };
        if (r.data.current_version_id) {
          const jobs = await db
            .from("background_jobs")
            .select("id,status,provider_id,last_error")
            .eq("entity_id", r.data.current_version_id);
          dbError(jobs.error);
          const ids = jobs.data?.map((j) => j.id) ?? [];
          const deliveries = ids.length
            ? await db
                .from("delivery_events")
                .select("event_type,occurred_at")
                .in("job_id", ids)
                .order("occurred_at", { ascending: false })
            : { data: [], error: null };
          dbError(deliveries.error);
          related.delivery = { jobs: jobs.data, events: deliveries.data };
        }
      }
      return json(res, 200, { ...r.data, ...related });
    }
    if (section === "requests" && id && req.method === "PATCH") {
      const v = await body(req, requestUpdateSchema);
      const r = await db.from(table).update(v).eq("id", id).select().single();
      dbError(r.error);
      return json(res, 200, r.data);
    }
    if (
      section === "requests" &&
      id &&
      action === "delete" &&
      req.method === "POST"
    ) {
      if (who.role !== "owner")
        throw new HttpError(
          403,
          "FORBIDDEN",
          "Suppression réservée au propriétaire.",
        );
      const v = await body(
        req,
        z.object({ confirmation: z.literal("SUPPRIMER") }),
      );
      void v;
      const r = await db.rpc("crm_schedule_purge", { p_id: id });
      dbError(r.error);
      return json(res, 202, { scheduled: true });
    }
    if (section === "clients" && !id && req.method === "POST") {
      const v = await body(req, clientUpdateSchema);
      const r = await db
        .from(table)
        .insert({
          ...v,
          email: v.email.toLowerCase(),
          phone: v.phone ? normalizePhone(v.phone) : "",
        })
        .select()
        .single();
      dbError(r.error);
      return json(res, 201, r.data);
    }
    if (section === "clients" && id && req.method === "PATCH") {
      const v = await body(req, clientUpdateSchema);
      const r = await db
        .from(table)
        .update({
          ...v,
          email: v.email.toLowerCase(),
          phone: v.phone ? normalizePhone(v.phone) : "",
        })
        .eq("id", id)
        .select()
        .single();
      dbError(r.error);
      return json(res, 200, r.data);
    }
    if (section === "quotes" && req.method === "POST") {
      if (!id || !action) {
        const v = await body(req, quoteDraftSchema);
        const r = await db.rpc("crm_save_quote", { p_id: id ?? null, p: v });
        dbError(r.error);
        return json(res, id ? 200 : 201, { id: r.data });
      }
      if (action === "finalize") {
        const v = await body(
          req,
          z
            .object({
              revision: z.number().int().min(0),
              confirm: z.literal(true),
            })
            .strict(),
        );
        const r = await db.rpc("crm_finalize_quote", {
          p_id: id,
          p_revision: v.revision,
        });
        dbError(r.error);
        return json(res, 200, { versionId: r.data });
      }
      if (action === "preview") {
        const snapshot = await draftSnapshot(db, id),
          file = await renderQuote(snapshot, snapshot.version === 0);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'inline; filename="mekweb-apercu.pdf"',
        );
        return res.end(file);
      }
      if (action === "pdf") {
        const v = await body(req, z.object({ versionId: uuid }));
        const row = await db
          .from("quote_versions")
          .select("*")
          .eq("id", v.versionId)
          .eq("quote_id", id)
          .single();
        dbError(row.error);
        const pdf = await issuedPdf(row.data as Version),
          link = await serviceDb()
            .storage.from("crm-documents")
            .createSignedUrl(pdf.path, 60, { download: pdf.filename });
        if (link.error)
          throw new HttpError(502, "PDF_DOWNLOAD", "Document indisponible.");
        return json(res, 200, { url: link.data.signedUrl });
      }
      if (
        [
          "send",
          "revision",
          "accepted",
          "rejected",
          "cancelled",
          "expired",
        ].includes(action)
      ) {
        const v = await body(
          req,
          z.object({ detail: z.string().trim().max(3000) }).strict(),
        );
        if (action === "send") {
          env("RESEND_API_KEY");
          env("EMAIL_FROM");
        }
        const r = await db.rpc("crm_quote_action", {
          p_id: id,
          p_action: action,
          p_detail: v.detail,
        });
        dbError(r.error);
        return json(res, action === "send" ? 202 : 200, {
          id: r.data,
          queued: action === "send",
        });
      }
    }
    if (section === "pricing" && req.method === "POST") {
      const v = await body(req, pricingSchema),
        r = await db.from(table).insert(v).select().single();
      dbError(r.error);
      return json(res, 201, r.data);
    }
    if (section === "pricing" && id && req.method === "PATCH") {
      const v = await body(req, pricingSchema),
        r = await db.from(table).update(v).eq("id", id).select().single();
      dbError(r.error);
      return json(res, 200, r.data);
    }
    if (section === "projects" && id && req.method === "PATCH") {
      const v = await body(
        req,
        z
          .object({
            status: z.enum([
              "planned",
              "active",
              "on_hold",
              "completed",
              "cancelled",
            ]),
            notes: z.string().max(5000),
            starts_on: z.string().date().nullable(),
            delivery_on: z.string().date().nullable(),
          })
          .strict(),
      );
      const r = await db.from(table).update(v).eq("id", id).select().single();
      dbError(r.error);
      return json(res, 200, r.data);
    }
    throw new HttpError(405, "METHOD", "Action non disponible.");
  } catch (error) {
    if (error instanceof ZodError)
      return json(res, 422, {
        code: "VALIDATION",
        message: "Vérifiez les informations saisies.",
        fields: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
        requestId,
      });
    if (error instanceof HttpError)
      return json(res, error.status, {
        code: error.code,
        message: error.message,
        requestId,
      });
    console.error(
      JSON.stringify({ requestId, event: "api_error", code: "UNEXPECTED" }),
    );
    return json(res, 500, {
      code: "UNEXPECTED",
      message:
        "Le service n’a pas pu traiter la demande. Aucune confirmation d’enregistrement ne peut être donnée.",
      requestId,
    });
  }
}
