import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export function env(name: string) {
  const value = process.env[name];
  if (!value)
    throw new HttpError(
      503,
      "NOT_CONFIGURED",
      "Le service n’est pas encore disponible. Contactez-nous par email ou WhatsApp.",
    );
  return value;
}
export const hash = (s: string | Uint8Array) =>
  createHash("sha256").update(s).digest("hex");
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
const options = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
};
export function serviceDb() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), options);
}
export function authDb(token?: string) {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_PUBLISHABLE_KEY"), {
    ...options,
    ...(token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : {}),
  });
}
export function dbError(error: { message: string } | null) {
  if (!error) return;
  const map: Record<string, [number, string]> = {
    LEGAL_HOLD: [
      409,
      "Ce dossier contient un document commercial émis. Vérifiez les obligations de conservation avant toute suppression.",
    ],
    IDEMPOTENCY_CONFLICT: [
      409,
      "Cette demande a été modifiée. Vérifiez les informations avant de réessayer.",
    ],
    SUBMISSION_EXPIRED: [409, "La session a expiré. Rechargez la page."],
    PRIVACY_NOT_CONFIGURED: [
      503,
      "La collecte des demandes n’est pas encore ouverte.",
    ],
    INVALID_DOCUMENTS: [
      422,
      "Les documents ne sont pas prêts ou ne sont pas valides.",
    ],
    FORBIDDEN: [403, "Accès non autorisé."],
    DRAFT_REQUIRED: [
      409,
      "Une version finalisée ne peut pas être modifiée. Créez une révision.",
    ],
    REVISION_CONFLICT: [
      409,
      "Le devis a été modifié ailleurs. Rechargez-le avant de continuer.",
    ],
    SETTINGS_INCOMPLETE: [
      422,
      "Vérifiez les informations légales, fiscales, les conditions et la validité du devis.",
    ],
    TAX_SETTINGS_MISMATCH: [
      422,
      "Le traitement fiscal doit correspondre à la configuration validée.",
    ],
    INVALID_TRANSITION: [
      409,
      "Cette action n’est pas disponible dans cet état.",
    ],
    EVIDENCE_REQUIRED: [422, "Ajoutez une note justifiant cette décision."],
  };
  const code = Object.keys(map).find((k) => error.message.includes(k));
  throw new HttpError(
    code ? map[code][0] : 500,
    code ?? "DATABASE_ERROR",
    code
      ? map[code][1]
      : "L’opération n’a pas abouti. Réessayez ou contactez l’administrateur.",
  );
}
export function json(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(value));
}
export async function body<S extends z.ZodTypeAny>(
  req: IncomingMessage,
  schema: S,
): Promise<z.output<S>> {
  if (!req.headers["content-type"]?.startsWith("application/json"))
    throw new HttpError(
      415,
      "CONTENT_TYPE",
      "Format de requête non pris en charge.",
    );
  const raw = await rawBody(req, 100000);
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Requête invalide.");
  }
  return schema.parse(data);
}
export async function rawBody(
  req: IncomingMessage,
  limit = 250000,
  exact = false,
) {
  const parsed = req.readableEnded
    ? (req as IncomingMessage & { body?: unknown }).body
    : undefined;
  if (
    exact &&
    parsed !== undefined &&
    typeof parsed !== "string" &&
    !Buffer.isBuffer(parsed)
  )
    throw new HttpError(400, "RAW_BODY_REQUIRED", "Corps original requis.");
  if (parsed !== undefined) {
    const result =
      typeof parsed === "string"
        ? parsed
        : Buffer.isBuffer(parsed)
          ? parsed.toString("utf8")
          : JSON.stringify(parsed);
    if (Buffer.byteLength(result) > limit)
      throw new HttpError(413, "TOO_LARGE", "La requête est trop volumineuse.");
    return result;
  }
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > limit)
      throw new HttpError(413, "TOO_LARGE", "La requête est trop volumineuse.");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}
export function checkOrigin(req: IncomingMessage) {
  const origin = req.headers.origin;
  if (!origin || origin !== new URL(env("APP_ORIGIN")).origin)
    throw new HttpError(403, "ORIGIN", "Origine de la requête non autorisée.");
}
export async function rateLimit(
  req: IncomingMessage,
  scope: string,
  limit: number,
  seconds: number,
) {
  // Only the trusted Vercel ingress header is used in production; never arbitrary x-forwarded-for.
  const ip = process.env.VERCEL
    ? String(req.headers["x-vercel-forwarded-for"] ?? "unknown")
        .split(",")[0]
        .trim()
    : (req.socket.remoteAddress ?? "local");
  const key = createHmac("sha256", env("RATE_LIMIT_HASH_SECRET"))
    .update(`${scope}:${ip}`)
    .digest("hex");
  const { data, error } = await serviceDb().rpc("crm_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_seconds: seconds,
  });
  dbError(error);
  if (!data)
    throw new HttpError(
      429,
      "RATE_LIMIT",
      "Trop de tentatives. Veuillez patienter avant de réessayer.",
    );
}
export async function verifyChallenge(token: string) {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: env("TURNSTILE_SECRET_KEY"),
        response: token,
      }),
      signal: AbortSignal.timeout(10000),
    },
  );
  const data = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  if (
    !response.ok ||
    !data.success ||
    data.hostname !== new URL(env("APP_ORIGIN")).hostname ||
    data.action !== "quotation"
  )
    throw new HttpError(
      422,
      "CHALLENGE",
      "La vérification de sécurité a expiré. Veuillez la relancer.",
    );
}
export type Session = {
  access: string;
  refresh: string;
  expires: number;
  loginAt: number;
  csrf: string;
};
const cookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Host-mekweb_session"
    : "mekweb_session";
function sessionKey() {
  const key = Buffer.from(env("SESSION_ENCRYPTION_KEY"), "base64");
  if (key.length !== 32)
    throw new HttpError(
      503,
      "SESSION_CONFIG",
      "Authentification indisponible.",
    );
  return key;
}
export function sealSession(session: Session) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", sessionKey(), iv);
  const data = Buffer.concat([
    cipher.update(JSON.stringify(session)),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
}
export function openSession(value: string): Session | null {
  try {
    const bytes = Buffer.from(value, "base64url");
    const decipher = createDecipheriv(
      "aes-256-gcm",
      sessionKey(),
      bytes.subarray(0, 12),
    );
    decipher.setAuthTag(bytes.subarray(12, 28));
    const data: unknown = JSON.parse(
      Buffer.concat([
        decipher.update(bytes.subarray(28)),
        decipher.final(),
      ]).toString(),
    );
    return z
      .object({
        access: z.string(),
        refresh: z.string(),
        expires: z.number(),
        loginAt: z.number(),
        csrf: z.string().min(32),
      })
      .parse(data);
  } catch {
    return null;
  }
}
export function writeSession(res: ServerResponse, session: Session | null) {
  res.setHeader(
    "Set-Cookie",
    `${cookieName()}=${session ? sealSession(session) : ""}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${session ? Math.max(0, Math.min(28800, session.loginAt + 28800 - Math.floor(Date.now() / 1000))) : 0}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
}
export type Admin = {
  id: string;
  email: string;
  role: "owner" | "admin";
  needsMfa: boolean;
  session: Session;
  db: SupabaseClient;
};
export async function admin(
  req: IncomingMessage,
  res: ServerResponse,
  allowMfa = false,
): Promise<Admin> {
  const cookies = req.headers.cookie
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${cookieName()}=`));
  let session = cookies
    ? openSession(cookies.slice(cookieName().length + 1))
    : null;
  const now = Math.floor(Date.now() / 1000);
  if (!session || session.loginAt + 28800 < now)
    throw new HttpError(
      401,
      "UNAUTHENTICATED",
      "Connectez-vous à MekWeb Studio.",
    );
  if (session.expires < now + 45) {
    const { data, error } = await authDb().auth.refreshSession({
      refresh_token: session.refresh,
    });
    if (error || !data.session) {
      writeSession(res, null);
      throw new HttpError(401, "SESSION_EXPIRED", "Votre session a expiré.");
    }
    session = {
      ...session,
      access: data.session.access_token,
      refresh: data.session.refresh_token,
      expires: data.session.expires_at!,
    };
    writeSession(res, session);
  }
  const db = authDb(session.access);
  const { data: identity, error } = await db.auth.getUser(session.access);
  if (error || !identity.user)
    throw new HttpError(401, "UNAUTHENTICATED", "Session invalide.");
  const { data: profile, error: profileError } = await db
    .from("admin_profiles")
    .select("id,role,active")
    .eq("id", identity.user.id)
    .single();
  if (profileError || !profile?.active)
    throw new HttpError(
      403,
      "ADMIN_DISABLED",
      "Ce compte n’a pas accès au studio.",
    );
  const validation = await db.rpc("crm_admin_session_valid");
  if (validation.error || validation.data !== true)
    throw new HttpError(
      401,
      "SESSION_REVOKED",
      "Votre session a été révoquée.",
    );
  const claims = JSON.parse(
    Buffer.from(session.access.split(".")[1], "base64url").toString(),
  ) as { aal?: string };
  const needsMfa = claims.aal !== "aal2";
  if (needsMfa && !allowMfa)
    throw new HttpError(
      403,
      "MFA_REQUIRED",
      "Confirmez votre code de double authentification.",
    );
  if (!["GET", "HEAD"].includes(req.method ?? "GET")) {
    checkOrigin(req);
    const csrf = String(req.headers["x-csrf-token"] ?? "");
    if (!safeEqual(csrf, session.csrf))
      throw new HttpError(403, "CSRF", "Rechargez la page avant de réessayer.");
  }
  return {
    id: identity.user.id,
    email: identity.user.email ?? "",
    role: profile.role,
    needsMfa,
    session,
    db,
  };
}
export function initialSession(
  access: string,
  refresh: string,
  expires: number,
): Session {
  return {
    access,
    refresh,
    expires,
    loginAt: Math.floor(Date.now() / 1000),
    csrf: randomBytes(32).toString("hex"),
  };
}
