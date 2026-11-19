import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import {
  admin,
  authDb,
  body,
  checkOrigin,
  HttpError,
  initialSession,
  json,
  rateLimit,
  writeSession,
} from "./core.js";
export async function authRoute(
  path: string,
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (path === "auth/login" && req.method === "POST") {
    checkOrigin(req);
    await rateLimit(req, "login", 8, 900);
    const value = await body(
      req,
      z
        .object({
          email: z.string().email().max(254),
          password: z.string().min(1).max(200),
        })
        .strict(),
    );
    const { data, error } = await authDb().auth.signInWithPassword(value);
    if (error || !data.session)
      throw new HttpError(
        401,
        "LOGIN_FAILED",
        "Email ou mot de passe incorrect.",
      );
    const { data: profile } = await authDb(data.session.access_token)
      .from("admin_profiles")
      .select("active")
      .eq("id", data.user.id)
      .single();
    if (!profile?.active)
      throw new HttpError(
        403,
        "FORBIDDEN",
        "Ce compte n’a pas accès au studio.",
      );
    writeSession(
      res,
      initialSession(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at!,
      ),
    );
    return json(res, 200, { authenticated: true });
  }
  const user = await admin(req, res, true);
  if (path === "auth/session" && req.method === "GET")
    return json(res, 200, {
      user: { id: user.id, email: user.email, role: user.role },
      csrf: user.session.csrf,
      needsMfa: user.needsMfa,
    });
  if (path === "auth/logout" && req.method === "POST") {
    await user.db.auth.admin.signOut(user.session.access, "local");
    writeSession(res, null);
    return json(res, 200, { signedOut: true });
  }
  if (path.startsWith("auth/mfa")) {
    const result = await user.db.auth.setSession({
      access_token: user.session.access,
      refresh_token: user.session.refresh,
    });
    if (result.error)
      throw new HttpError(401, "UNAUTHENTICATED", "Session invalide.");
  }
  if (path === "auth/mfa" && req.method === "GET") {
    const { data, error } = await user.db.auth.mfa.listFactors();
    if (error) throw new HttpError(502, "MFA", "Vérification indisponible.");
    return json(res, 200, {
      factors: data.totp
        .filter((f) => f.status === "verified")
        .map((f) => ({ id: f.id, friendly_name: f.friendly_name })),
    });
  }
  if (path === "auth/mfa/enroll" && req.method === "POST") {
    const { data, error } = await user.db.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "MekWeb Studio",
    });
    if (error)
      throw new HttpError(
        422,
        "MFA",
        "Impossible de préparer la double authentification.",
      );
    return json(res, 200, {
      id: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }
  if (path === "auth/mfa/verify" && req.method === "POST") {
    await rateLimit(req, "mfa", 8, 900);
    const value = await body(
      req,
      z
        .object({
          factorId: z.string().uuid(),
          code: z.string().regex(/^\d{6}$/),
        })
        .strict(),
    );
    const { data, error } = await user.db.auth.mfa.challengeAndVerify(value);
    if (error) throw new HttpError(422, "MFA", "Code invalide ou expiré.");
    writeSession(res, {
      ...user.session,
      access: data.access_token,
      refresh: data.refresh_token,
      expires: Math.floor(Date.now() / 1000) + data.expires_in,
    });
    return json(res, 200, { verified: true });
  }
  throw new HttpError(404, "NOT_FOUND", "Route introuvable.");
}
