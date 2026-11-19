export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public fields: { path: string; message: string }[] = [],
  ) {
    super(message);
  }
}
let csrf = "";
export async function api<T>(
  path: string,
  options: {
    method?: string;
    data?: unknown;
    signal?: AbortSignal;
    raw?: boolean;
  } = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: "same-origin",
    headers: {
      ...(options.data !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    },
    ...(options.data !== undefined
      ? { body: JSON.stringify(options.data) }
      : {}),
    signal: options.signal,
  });
  if (!response.ok) {
    let problem: {
      message?: string;
      code?: string;
      fields?: { path: string; message: string }[];
    } = {};
    try {
      problem = await response.json();
    } catch {
      /* A proxy may return HTML when the API is not running. */
    }
    if (
      path.startsWith("admin/") &&
      (response.status === 401 ||
        ["ADMIN_DISABLED", "MFA_REQUIRED"].includes(problem.code ?? ""))
    )
      window.dispatchEvent(new Event("mekweb-session-expired"));
    throw new ApiError(
      problem.message ??
        "Le service est indisponible. Veuillez réessayer plus tard.",
      response.status,
      problem.code ?? "UNAVAILABLE",
      problem.fields,
    );
  }
  if (options.raw) return (await response.blob()) as T;
  const data = await response.json();
  if (path === "auth/session") csrf = data.csrf ?? "";
  if (path === "auth/logout") csrf = "";
  return data as T;
}
export type PublicConfig = {
  requestsEnabled: boolean;
  uploadsEnabled: boolean;
  agency: {
    name: string;
    email: string;
    phone: string;
    city: string;
    privacy_notice: string;
    privacy_notice_version: string;
    privacy_verified: boolean;
  } | null;
};
export type AdminSession = {
  user: { id: string; email: string; role: "owner" | "admin" };
  csrf: string;
  needsMfa: boolean;
};
