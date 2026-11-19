import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  Plus,
  LogOut,
  Search,
  LayoutDashboard,
  Inbox,
  Users,
  FileText,
  Folder,
  Settings,
  List,
  ShieldCheck,
  Trash2,
  Download,
  Send,
  Check,
  RefreshCw,
} from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { api, ApiError, type AdminSession } from "@/lib/platform-api";
import {
  statusLabels,
  projectTypes,
  formatMoney,
  features,
} from "../../../shared/catalog";
import { agencySchema, type QuoteDraft } from "../../../shared/schemas";
import { calculateQuote, decimalToCents } from "../../../shared/money";
import type {
  Client,
  RequestRow,
  QuoteRow,
  Snapshot,
  Version,
} from "../../../server/models";
import "@/platform.css";
const message = (e: unknown) =>
  e instanceof Error ? e.message : "L’opération n’a pas abouti.";
const date = (s: string) =>
  new Intl.DateTimeFormat("fr-MA", { dateStyle: "medium" }).format(new Date(s));
const links = [
  ["/admin", "Vue d’ensemble", LayoutDashboard],
  ["/admin/demandes", "Demandes", Inbox],
  ["/admin/clients", "Clients", Users],
  ["/admin/devis", "Devis", FileText],
  ["/admin/projets", "Projets", Folder],
  ["/admin/catalogue", "Catalogue", List],
  ["/admin/parametres", "Paramètres", Settings],
] as const;
export function StudioLayout() {
  const query = useQuery({
      queryKey: ["admin-session"],
      queryFn: () => api<AdminSession>("auth/session"),
      retry: false,
      staleTime: 30000,
    }),
    navigate = useNavigate(),
    cache = useQueryClient();
  useEffect(() => {
    const expired = () => {
      cache.clear();
      navigate("/admin/login", { replace: true });
    };
    window.addEventListener("mekweb-session-expired", expired);
    return () => window.removeEventListener("mekweb-session-expired", expired);
  }, [cache, navigate]);
  if (query.isPending)
    return (
      <div className="studio-loading" role="status">
        Ouverture de MekWeb Studio…
      </div>
    );
  if (query.error) {
    if (query.error instanceof ApiError && query.error.status === 401)
      return <Navigate to="/admin/login" replace />;
    return (
      <div className="studio-loading">
        <p role="alert">{message(query.error)}</p>
        <Link to="/admin/login" className="text-link">
          Accéder à la connexion
        </Link>
      </div>
    );
  }
  if (query.data.needsMfa) return <Navigate to="/admin/login" replace />;
  return (
    <div className="studio-app">
      <aside className="studio-sidebar">
        <Link to="/admin">
          <BrandLogo />
        </Link>
        <p className="studio-label">ESPACE INTERNE</p>
        <nav aria-label="Navigation du studio">
          {links.map(([href, label, Icon]) => (
            <NavLink key={href} to={href} end={href === "/admin"}>
              <Icon size={17} strokeWidth={1.4} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="studio-sidebar-bottom">
          <span>
            <ShieldCheck size={14} />
            Session administrateur
          </span>
          <small>{query.data.user.email}</small>
          <button
            className="text-link"
            onClick={async () => {
              await api("auth/logout", { method: "POST", data: {} });
              cache.clear();
              navigate("/admin/login");
            }}
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </aside>
      <div className="studio-workspace">
        <header className="studio-topbar">
          <span>
            MekWeb <em>Studio</em>
          </span>
          <Link to="/" className="text-link">
            Voir le site <ArrowUpRight size={14} />
          </Link>
        </header>
        <main className="studio-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export function Login() {
  useEffect(() => {
    const old = document.title;
    document.title = "Connexion | MekWeb Studio";
    return () => {
      document.title = old;
    };
  }, []);
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [code, setCode] = useState(""),
    [factor, setFactor] = useState(""),
    [qr, setQr] = useState(""),
    [secret, setSecret] = useState("");
  const nav = useNavigate(),
    cache = useQueryClient();
  const session = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => api<AdminSession>("auth/session"),
    retry: false,
  });
  const factors = useQuery({
    queryKey: ["admin-factors"],
    queryFn: () => api<{ factors: { id: string }[] }>("auth/mfa"),
    enabled: Boolean(session.data?.needsMfa),
    retry: false,
  });
  useEffect(() => {
    if (session.data && !session.data.needsMfa)
      nav("/admin", { replace: true });
  }, [session.data, nav]);
  async function login() {
    setBusy(true);
    setError("");
    try {
      await api("auth/login", { method: "POST", data: { email, password } });
      setPassword("");
      await cache.invalidateQueries({ queryKey: ["admin-session"] });
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function enroll() {
    setError("");
    setBusy(true);
    try {
      const r = await api<{ id: string; qr: string; secret: string }>(
        "auth/mfa/enroll",
        { method: "POST", data: {} },
      );
      setFactor(r.id);
      setQr(r.qr);
      setSecret(r.secret);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function verify() {
    setBusy(true);
    setError("");
    try {
      await api("auth/mfa/verify", {
        method: "POST",
        data: { factorId: factor || factors.data?.factors[0]?.id, code },
      });
      setCode("");
      await cache.invalidateQueries({ queryKey: ["admin-session"] });
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  const mfa = Boolean(session.data?.needsMfa);
  return (
    <div className="studio-login">
      <section className="login-brand">
        <Link to="/">
          <BrandLogo />
        </Link>
        <p className="eyebrow">MekWeb Studio</p>
        <h1>
          Le soin du détail.
          <br />
          <em>Dans chaque projet.</em>
        </h1>
        <p>
          Un espace privé pour suivre vos échanges, préparer vos devis et
          accompagner vos clients.
        </p>
        <span>Rabat, Maroc · Espace réservé à l’équipe</span>
      </section>
      <section className="login-form">
        <div>
          <p className="eyebrow">Accès privé</p>
          <h2>{mfa ? "Confirmez votre identité." : "Bienvenue au studio."}</h2>
          <p className="form-note">
            {mfa
              ? "Utilisez le code de votre application d’authentification."
              : "Connectez-vous avec votre compte administrateur autorisé."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void (mfa ? verify() : login());
            }}
          >
            {mfa ? (
              <>
                {factors.isPending ? (
                  <p>Chargement de la double authentification…</p>
                ) : !factors.data?.factors.length && !factor ? (
                  <button
                    type="button"
                    className="platform-button secondary"
                    onClick={enroll}
                    disabled={busy}
                  >
                    Configurer la double authentification
                  </button>
                ) : null}
                {qr && (
                  <div className="mfa-setup">
                    <img
                      src={
                        qr.startsWith("data:")
                          ? qr
                          : `data:image/svg+xml;utf8,${encodeURIComponent(qr)}`
                      }
                      alt="QR code de configuration de la double authentification"
                    />
                    <p className="form-note">
                      Ajoutez ce compte dans votre application. Conservez vos
                      moyens de récupération.
                    </p>
                    <code>{secret}</code>
                  </div>
                )}
                {(factor || factors.data?.factors.length) && (
                  <>
                    <label className="field-label" htmlFor="mfa-code">
                      Code à six chiffres
                    </label>
                    <input
                      id="mfa-code"
                      className="studio-input"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      required
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <label className="field-label" htmlFor="admin-email">
                  Adresse email
                </label>
                <input
                  className="studio-input"
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="field-label" htmlFor="admin-password">
                  Mot de passe
                </label>
                <input
                  className="studio-input"
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="form-note">
                  Accès sur invitation. Pour une récupération de compte,
                  contactez le propriétaire du studio.
                </p>
              </>
            )}
            {error && (
              <p className="platform-error" role="alert">
                {error}
              </p>
            )}
            {(!mfa || factor || factors.data?.factors.length) && (
              <button className="platform-button" disabled={busy}>
                {busy
                  ? "Vérification…"
                  : mfa
                    ? "Vérifier le code"
                    : "Se connecter"}
                <ArrowUpRight size={16} />
              </button>
            )}
          </form>
          <Link to="/" className="text-link">
            <ArrowLeft size={14} />
            Retour au site
          </Link>
        </div>
      </section>
    </div>
  );
}
function Title({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="studio-page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}
function ErrorBox({ error }: { error: unknown }) {
  return error ? (
    <p className="platform-error" role="alert">
      {message(error)}
    </p>
  ) : null;
}
function Badge({ value }: { value: string }) {
  return (
    <span className={`studio-badge status-${value}`}>
      {statusLabels[value] ?? value}
    </span>
  );
}
export function Overview() {
  const query = useQuery({
    queryKey: ["overview"],
    queryFn: () => api<{ counts: number[] }>("admin/overview"),
  });
  return (
    <>
      <Title
        eyebrow="Votre activité"
        title="Une vision claire, pour avancer."
      />
      <ErrorBox error={query.error} />
      <div className="metric-grid">
        {[
          "Nouvelles demandes",
          "Demandes à l’étude",
          "Devis en préparation",
          "Devis envoyés",
          "Devis acceptés",
          "Projets en cours",
        ].map((label, i) => (
          <article key={label}>
            <span>0{i + 1}</span>
            <strong>{query.data ? query.data.counts[i] : "—"}</strong>
            <p>{label}</p>
          </article>
        ))}
      </div>
      <div className="studio-welcome">
        <p className="eyebrow">Le prochain échange commence ici</p>
        <h2>
          Chaque brief mérite
          <br />
          <em>votre attention.</em>
        </h2>
        <p>
          Retrouvez les demandes, prenez le temps de comprendre les besoins et
          préparez une proposition adaptée.
        </p>
        <Link to="/admin/demandes" className="platform-button">
          Consulter les demandes <ArrowUpRight size={16} />
        </Link>
      </div>
    </>
  );
}
export function Records({
  kind,
}: {
  kind: "requests" | "clients" | "quotes" | "projects" | "pricing";
}) {
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState(""),
    [page, setPage] = useState(0);
  const [params] = useSearchParams();
  const titles = {
    requests: "Demandes de projet",
    clients: "Vos clients",
    quotes: "Vos propositions",
    projects: "Les projets en cours",
    pricing: "Catalogue de prestations",
  };
  const href = {
    requests: "demandes",
    clients: "clients",
    quotes: "devis",
    projects: "projets",
    pricing: "catalogue",
  };
  const query = useQuery({
    queryKey: ["records", kind, search, filter, page, params.get("client")],
    queryFn: () =>
      api<{ items: Record<string, unknown>[]; total: number }>(
        `admin/${kind}?${new URLSearchParams({ search, status: filter, page: String(page), ...(params.get("client") ? { client: params.get("client")! } : {}) })}`,
      ),
  });
  return (
    <>
      <Title eyebrow="MekWeb Studio" title={titles[kind]}>
        {kind === "clients" ? (
          <Link className="platform-button" to="/admin/clients/nouveau">
            <Plus size={16} />
            Nouveau client
          </Link>
        ) : kind === "quotes" ? (
          <Link className="platform-button" to="/admin/devis/nouveau">
            <Plus size={16} />
            Nouveau devis
          </Link>
        ) : null}
      </Title>
      <div className="records-toolbar">
        <label>
          <Search size={16} />
          <span className="sr-only">Rechercher</span>
          <input
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </label>
        {["requests", "quotes", "projects"].includes(kind) && (
          <select
            aria-label="Filtrer par statut"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tous les statuts</option>
            {(kind === "requests"
              ? [
                  "new",
                  "under_review",
                  "contacted",
                  "quoted",
                  "accepted",
                  "rejected",
                  "archived",
                ]
              : kind === "quotes"
                ? [
                    "draft",
                    "finalized",
                    "sent",
                    "accepted",
                    "rejected",
                    "cancelled",
                    "expired",
                  ]
                : ["planned", "active", "on_hold", "completed", "cancelled"]
            ).map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        )}
      </div>
      <ErrorBox error={query.error} />
      {query.isPending ? (
        <p role="status">Chargement…</p>
      ) : query.data?.items.length ? (
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>{kind === "clients" ? "Client" : "Dossier"}</th>
                <th>{kind === "clients" ? "Contact" : "Référence / état"}</th>
                <th>Date</th>
                <th>
                  <span className="sr-only">Ouvrir</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {query.data.items.map((row) => (
                <tr key={String(row.id)}>
                  <td>
                    <Link to={`/admin/${href[kind]}/${row.id}`}>
                      {String(
                        row.business_name ??
                          row.full_name ??
                          row.title ??
                          row.name,
                      )}
                    </Link>
                    {kind === "clients" && (
                      <small>{String(row.company_name ?? "")}</small>
                    )}
                  </td>
                  <td>
                    {row.status ? (
                      <Badge value={String(row.status)} />
                    ) : (
                      String(row.email ?? "")
                    )}
                    {row.reference && <small>{String(row.reference)}</small>}
                  </td>
                  <td>{date(String(row.created_at))}</td>
                  <td>
                    <Link
                      to={`/admin/${href[kind]}/${row.id}`}
                      className="table-open"
                      aria-label="Ouvrir le dossier"
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !query.error ? (
        <div className="studio-empty">
          <Inbox size={30} strokeWidth={1} />
          <h2>Aucun dossier pour le moment.</h2>
          <p>
            Les informations enregistrées apparaîtront ici. Aucun exemple n’est
            ajouté à vos données.
          </p>
        </div>
      ) : null}
      <div className="records-pagination">
        <span>{query.data ? `${query.data.total} résultat(s)` : "—"}</span>
        <button
          className="text-link"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Précédent
        </button>
        <button
          className="text-link"
          disabled={!query.data || page * 25 + 25 >= query.data.total}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant
        </button>
      </div>
    </>
  );
}
const fieldLabels: Record<string, string> = {
  business_name: "Entreprise",
  project_type: "Type de projet",
  sector: "Secteur",
  existing_website: "Site actuel",
  business_description: "Activité",
  objective: "Objectif",
  audience: "Public visé",
  budget: "Budget indicatif",
  launch_date: "Date souhaitée",
  urgency: "Échéance",
  priorities: "Priorités",
  notes: "Notes du client",
  contact_method: "Contact préféré",
  pages: "Pages envisagées",
  style: "Style",
  branding: "Identité visuelle",
  content: "Contenus",
  languages: "Langues",
  features: "Fonctionnalités",
};
const words: Record<string, string> = {
  unknown: "À définir",
  ready: "Disponible",
  partial: "En partie",
  needed: "Accompagnement souhaité",
  discuss: "À définir ensemble",
  flexible: "Flexible",
  "1month": "Dans le mois",
  "3months": "Sous trois mois",
  "under-1500": "Moins de 1 500 DH",
  "1500-2500": "1 500 à 2 500 DH",
  "2500-5000": "2 500 à 5 000 DH",
  "5000-10000": "5 000 à 10 000 DH",
  "10000+": "Plus de 10 000 DH",
  fr: "Français",
  ar: "Arabe",
  en: "Anglais",
  other: "Autre",
  email: "Email",
  phone: "Téléphone",
  whatsapp: "WhatsApp",
  design: "Design",
  speed: "Rapidité",
  visibility: "Visibilité",
  sales: "Ventes",
  ease: "Simplicité",
};
function human(v: unknown): string {
  if (Array.isArray(v)) return v.map(human).join(", ");
  return typeof v === "string"
    ? (projectTypes.find((p) => p.id === v)?.label ??
        features.find((f) => f.id === v)?.label ??
        words[v] ??
        v)
    : v == null
      ? "Non renseigné"
      : String(v);
}
function Details({ value }: { value: Record<string, unknown> }) {
  return (
    <dl className="detail-grid">
      {Object.entries(fieldLabels)
        .filter(([k]) => k in value)
        .map(([k, l]) => (
          <div key={k}>
            <dt>{l}</dt>
            <dd>{human(value[k]) || "Non renseigné"}</dd>
          </div>
        ))}
    </dl>
  );
}
export function RequestDetail() {
  const { id } = useParams(),
    cache = useQueryClient();
  const q = useQuery({
    queryKey: ["request", id],
    queryFn: () =>
      api<
        RequestRow & {
          client: Client;
          requirements: Record<string, unknown>;
          documents: { id: string; filename: string; scan_status: string }[];
        }
      >(`admin/requests/${id}`),
  });
  const [status, setStatus] = useState(""),
    [priority, setPriority] = useState(""),
    [notes, setNotes] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (q.data) {
      setStatus(q.data.status);
      setPriority(q.data.priority);
      setNotes(q.data.internal_notes);
    }
  }, [q.data]);
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api(`admin/requests/${id}`, {
        method: "PATCH",
        data: { status, priority, internal_notes: notes },
      });
      await cache.invalidateQueries({ queryKey: ["request", id] });
      setNotice("Suivi enregistré.");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link className="text-link" to="/admin/demandes">
        <ArrowLeft size={14} />
        Toutes les demandes
      </Link>
      <ErrorBox error={q.error} />
      {q.data && (
        <>
          <Title eyebrow={q.data.reference} title={q.data.business_name}>
            <Link
              className="platform-button"
              to={`/admin/devis/nouveau?request=${id}`}
            >
              <Plus size={16} />
              Préparer un devis
            </Link>
          </Title>
          <div className="studio-detail-layout">
            <div>
              <section className="studio-panel">
                <h2>Le brief du projet</h2>
                <Details value={q.data} />
                <Details value={q.data.requirements} />
              </section>
              <section className="studio-panel">
                <h2>Pièces jointes</h2>
                {q.data.documents.length ? (
                  q.data.documents.map((d) => (
                    <button
                      className="text-link"
                      key={d.id}
                      disabled={d.scan_status !== "clean"}
                      onClick={async () => {
                        try {
                          const r = await api<{ url: string }>(
                            `admin/documents/${d.id}`,
                          );
                          window.location.assign(r.url);
                        } catch (e) {
                          setError(message(e));
                        }
                      }}
                    >
                      <Download size={14} />
                      {d.filename} ·{" "}
                      {d.scan_status === "clean" ? "Vérifié" : "Indisponible"}
                    </button>
                  ))
                ) : (
                  <p>Aucun document joint.</p>
                )}
              </section>
            </div>
            <aside>
              <section className="studio-panel">
                <h2>Votre interlocuteur</h2>
                <strong>{q.data.client.full_name}</strong>
                <p>{q.data.client.company_name}</p>
                <a className="text-link" href={`mailto:${q.data.client.email}`}>
                  {q.data.client.email}
                </a>
                {q.data.client.phone && (
                  <a className="text-link" href={`tel:${q.data.client.phone}`}>
                    {q.data.client.phone}
                  </a>
                )}
                <p>{q.data.client.city}</p>
                <Link
                  className="text-link"
                  to={`/admin/clients/${q.data.client_id}`}
                >
                  Fiche client <ArrowUpRight size={14} />
                </Link>
              </section>
              <section className="studio-panel">
                <h2>Suivi interne</h2>
                <label className="field-label" htmlFor="request-status">
                  Statut
                </label>
                <select
                  id="request-status"
                  className="studio-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {[
                    "new",
                    "under_review",
                    "contacted",
                    "quoted",
                    "accepted",
                    "rejected",
                    "archived",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
                <label className="field-label" htmlFor="request-priority">
                  Priorité
                </label>
                <select
                  id="request-priority"
                  className="studio-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {[
                    ["low", "Basse"],
                    ["normal", "Normale"],
                    ["high", "Haute"],
                  ].map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <label className="field-label" htmlFor="request-notes">
                  Notes privées
                </label>
                <textarea
                  id="request-notes"
                  className="studio-input"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  className="platform-button"
                  onClick={save}
                  disabled={busy}
                >
                  Enregistrer le suivi
                </button>
                {notice && (
                  <p role="status" className="form-note">
                    {notice}
                  </p>
                )}
                <button
                  className="text-link danger"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Supprimer ce dossier archivé et ses documents ? Les dossiers avec devis émis sont protégés.",
                      )
                    )
                      return;
                    try {
                      await api(`admin/requests/${id}/delete`, {
                        method: "POST",
                        data: { confirmation: "SUPPRIMER" },
                      });
                      setNotice(
                        "Suppression programmée. Le traitement sera contrôlé par le service de conservation.",
                      );
                    } catch (e) {
                      setError(message(e));
                    }
                  }}
                >
                  Demander la suppression
                </button>
              </section>
            </aside>
          </div>
        </>
      )}
      <ErrorBox error={error ? new Error(error) : null} />
    </>
  );
}
export function ClientDetail() {
  const { id } = useParams(),
    nav = useNavigate();
  const q = useQuery({
    queryKey: ["client", id],
    queryFn: () => api<Client>(`admin/clients/${id}`),
    enabled: Boolean(id && id !== "nouveau"),
  });
  const [values, setValues] = useState({
      full_name: "",
      company_name: "",
      email: "",
      phone: "",
      city: "",
      internal_notes: "",
    }),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (q.data)
      setValues({
        full_name: q.data.full_name,
        company_name: q.data.company_name,
        email: q.data.email,
        phone: q.data.phone,
        city: q.data.city,
        internal_notes: q.data.internal_notes,
      });
  }, [q.data]);
  const history = useQuery({
    queryKey: ["client-history", id],
    queryFn: async () => {
      const [requests, quotes] = await Promise.all([
        api<{ items: RequestRow[] }>(`admin/requests?client=${id}`),
        api<{ items: QuoteRow[] }>(`admin/quotes?client=${id}`),
      ]);
      return { requests: requests.items, quotes: quotes.items };
    },
    enabled: Boolean(q.data),
  });
  return (
    <>
      <Title
        eyebrow="Relation client"
        title={q.data?.full_name ?? "Nouveau client"}
      />
      <ErrorBox error={q.error} />
      <form
        className="studio-panel"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            const r = await api<Client>(
              id ? `admin/clients/${id}` : "admin/clients",
              { method: id ? "PATCH" : "POST", data: values },
            );
            setNotice("Fiche client enregistrée.");
            if (!id) nav(`/admin/clients/${r.id}`);
          } catch (x) {
            setError(message(x));
          }
        }}
      >
        <div className="form-fields">
          {Object.entries({
            full_name: "Nom et prénom",
            company_name: "Société",
            email: "Email",
            phone: "Téléphone",
            city: "Ville",
            internal_notes: "Notes privées",
          }).map(([key, label]) => (
            <div
              key={key}
              className={key === "internal_notes" ? "field-full" : ""}
            >
              <label className="field-label" htmlFor={`client-${key}`}>
                {label}
              </label>
              {key === "internal_notes" ? (
                <textarea
                  id={`client-${key}`}
                  className="studio-input"
                  rows={4}
                  value={values.internal_notes}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, internal_notes: e.target.value }))
                  }
                />
              ) : (
                <input
                  id={`client-${key}`}
                  className="studio-input"
                  required={["full_name", "email"].includes(key)}
                  type={
                    key === "email" ? "email" : key === "phone" ? "tel" : "text"
                  }
                  value={values[key as keyof typeof values]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
        </div>
        <ErrorBox error={error ? new Error(error) : null} />
        <button className="platform-button">Enregistrer la fiche</button>
        {notice && <p role="status">{notice}</p>}
      </form>
      {id && (
        <section className="studio-panel">
          <h2>Historique de la relation</h2>
          <ErrorBox error={history.error} />
          {history.data && (
            <div className="client-history">
              <div>
                <h3>Demandes</h3>
                {history.data.requests.length ? (
                  history.data.requests.map((r) => (
                    <Link
                      className="history-link"
                      key={r.id}
                      to={`/admin/demandes/${r.id}`}
                    >
                      {r.reference}
                      <Badge value={r.status} />
                    </Link>
                  ))
                ) : (
                  <p>Aucune demande.</p>
                )}
              </div>
              <div>
                <h3>Devis</h3>
                {history.data.quotes.length ? (
                  history.data.quotes.map((r) => (
                    <Link
                      className="history-link"
                      key={r.id}
                      to={`/admin/devis/${r.id}`}
                    >
                      {r.reference ?? r.title}
                      <Badge value={r.status} />
                    </Link>
                  ))
                ) : (
                  <p>Aucun devis.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
type QuoteDetail = QuoteRow & {
  client: Client;
  items: QuoteDraft["items"];
  versions: Version[];
  events: {
    id: string;
    event_type: string;
    created_at: string;
    detail: string;
  }[];
  delivery: {
    jobs: {
      status: string;
      provider_id: string | null;
      last_error: string | null;
    }[];
    events: { event_type: string; occurred_at: string }[];
  };
};
type Line = {
  description: string;
  quantity: string;
  price: string;
  discount: string;
};
type SettingsData = ReturnType<typeof agencySchema.parse> & { id: string };
const centsInput = (c: number) =>
  `${Math.floor(c / 100)}.${String(c % 100).padStart(2, "0")}`;
export function QuoteEditor() {
  const { id } = useParams(),
    [params] = useSearchParams(),
    nav = useNavigate(),
    cache = useQueryClient();
  const q = useQuery({
    queryKey: ["quote", id],
    queryFn: () => api<QuoteDetail>(`admin/quotes/${id}`),
    enabled: Boolean(id),
  });
  const request = useQuery({
    queryKey: ["quote-request", params.get("request")],
    queryFn: () =>
      api<RequestRow & { client: Client }>(
        `admin/requests/${params.get("request")}`,
      ),
    enabled: !id && Boolean(params.get("request")),
  });
  const [clientSearch, setClientSearch] = useState("");
  const clients = useQuery({
    queryKey: ["quote-clients", clientSearch],
    queryFn: () =>
      api<{ items: Client[] }>(
        `admin/clients?search=${encodeURIComponent(clientSearch)}`,
      ),
  });
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => api<SettingsData>("admin/settings"),
  });
  const catalog = useQuery({
    queryKey: ["pricing"],
    queryFn: () =>
      api<{
        items: {
          id: string;
          name: string;
          description: string;
          unit_price_cents: number | null;
          active: boolean;
        }[];
      }>("admin/pricing"),
  });
  const [client, setClient] = useState(""),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [expiry, setExpiry] = useState(""),
    [timeline, setTimeline] = useState(""),
    [terms, setTerms] = useState(""),
    [notes, setNotes] = useState(""),
    [lines, setLines] = useState<Line[]>([
      { description: "", quantity: "1", price: "", discount: "0" },
    ]),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false),
    [confirmed, setConfirmed] = useState(false),
    [decision, setDecision] = useState(""),
    [versionId, setVersionId] = useState(""),
    [preview, setPreview] = useState("");
  const loaded = useRef("");
  useEffect(() => {
    if (q.data) {
      const v = q.data;
      setClient(v.client_id);
      setTitle(v.title);
      setDescription(v.description);
      setExpiry(v.expires_on);
      setTimeline(v.delivery_estimate);
      setTerms(v.payment_terms);
      setNotes(v.notes);
      setLines(
        v.items.map((i) => ({
          description: i.description,
          quantity: String(i.quantity),
          price: centsInput(i.unit_price_cents),
          discount: String(i.discount_bps / 100),
        })),
      );
      setVersionId(v.current_version_id ?? "");
      setDirty(false);
      setConfirmed(false);
      loaded.current = v.id;
    }
  }, [q.data]);
  useEffect(() => {
    if (!id && request.data) {
      setClient(request.data.client_id);
      setTitle(`Création web — ${request.data.business_name}`);
      setDescription(String(request.data.objective));
    }
  }, [id, request.data]);
  useEffect(() => {
    if (!id && settings.data && !terms) setTerms(settings.data.payment_terms);
  }, [id, settings.data, terms]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const draft = !id || q.data?.status === "draft",
    issued = q.data?.versions.find((v) => v.id === versionId)?.snapshot;
  function change(set: (s: string) => void, value: string) {
    set(value);
    setDirty(true);
    setConfirmed(false);
  }
  function lineChange(index: number, field: keyof Line, value: string) {
    setLines((v) =>
      v.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    );
    setDirty(true);
    setConfirmed(false);
  }
  function parsedItems() {
    return lines.map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unit_price_cents: decimalToCents(l.price),
      discount_bps: decimalToCents(l.discount),
    }));
  }
  let total: ReturnType<typeof calculateQuote> | null = null;
  try {
    total = calculateQuote(
      parsedItems(),
      settings.data?.tax_mode === "standard" ? settings.data.tax_bps : 0,
    );
  } catch {
    /* Incomplete draft fields intentionally have no calculated total. */
  }
  async function action(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    await action(async () => {
      const payload: QuoteDraft = {
        client_id: client,
        request_id: q.data?.request_id ?? request.data?.id ?? null,
        title,
        description,
        expires_on: expiry,
        delivery_estimate: timeline,
        payment_terms: terms,
        notes,
        tax_mode: settings.data?.tax_mode ?? "unconfigured",
        tax_bps: settings.data?.tax_bps ?? 0,
        tax_note: settings.data?.tax_note ?? "",
        items: parsedItems(),
        expected_revision: q.data?.revision ?? 0,
      };
      const result = await api<{ id: string }>(
        id ? `admin/quotes/${id}` : "admin/quotes",
        { method: "POST", data: payload },
      );
      if (id) {
        await cache.invalidateQueries({ queryKey: ["quote", id] });
        setDirty(false);
        setNotice("Brouillon enregistré.");
      } else nav(`/admin/devis/${result.id}`);
    });
  }
  async function quoteAction(name: string) {
    await action(async () => {
      await api(`admin/quotes/${id}/${name}`, {
        method: "POST",
        data: { detail: decision },
      });
      await cache.invalidateQueries({ queryKey: ["quote", id] });
      setNotice(
        name === "send"
          ? "Envoi mis en file. La livraison sera confirmée séparément par le prestataire."
          : "Action enregistrée.",
      );
    });
  }
  const field = (
    label: string,
    value: string,
    set: (s: string) => void,
    type = "text",
  ) => (
    <div>
      <label className="field-label" htmlFor={`quote-${label}`}>
        {label}
      </label>
      <input
        id={`quote-${label}`}
        className="studio-input"
        value={value}
        onChange={(e) => change(set, e.target.value)}
        type={type}
      />
    </div>
  );
  return (
    <>
      <Link className="text-link" to="/admin/devis">
        <ArrowLeft size={14} />
        Tous les devis
      </Link>
      <Title
        eyebrow={q.data?.reference ?? "Proposition à préparer"}
        title={
          id
            ? (q.data?.title ?? "Chargement…")
            : "Un devis à la hauteur du projet."
        }
      >
        {q.data && <Badge value={q.data.status} />}
      </Title>
      <ErrorBox error={q.error ?? request.error ?? settings.error} />
      {(!id || q.data) && (
        <>
          {draft ? (
            <>
              <section className="studio-panel">
                <div className="form-fields">
                  <div>
                    <label className="field-label" htmlFor="quote-client">
                      Client
                    </label>
                    {!id && !request.data && (
                      <input
                        className="studio-input"
                        aria-label="Rechercher un client pour le devis"
                        placeholder="Rechercher par nom…"
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          setClient("");
                        }}
                      />
                    )}
                    <select
                      id="quote-client"
                      className="studio-input"
                      value={client}
                      disabled={Boolean(id || request.data)}
                      onChange={(e) => change(setClient, e.target.value)}
                    >
                      <option value="">Choisir un client</option>
                      {q.data?.client &&
                        !clients.data?.items.some(
                          (c) => c.id === q.data.client_id,
                        ) && (
                          <option value={q.data.client_id}>
                            {q.data.client.full_name}
                          </option>
                        )}
                      {request.data?.client &&
                        !clients.data?.items.some(
                          (c) => c.id === request.data.client_id,
                        ) && (
                          <option value={request.data.client_id}>
                            {request.data.client.full_name}
                          </option>
                        )}
                      {clients.data?.items.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} · {c.company_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {field("Date de validité", expiry, setExpiry, "date")}
                  {field("Intitulé du projet", title, setTitle)}
                  {field("Délai estimé", timeline, setTimeline)}
                  <div className="field-full">
                    <label className="field-label" htmlFor="quote-description">
                      Description du projet
                    </label>
                    <textarea
                      id="quote-description"
                      className="studio-input"
                      value={description}
                      rows={3}
                      onChange={(e) => change(setDescription, e.target.value)}
                    />
                  </div>
                </div>
              </section>
              <section className="studio-panel">
                <div className="panel-title">
                  <h2>Prestations et montants</h2>
                  <select
                    className="studio-input catalogue-select"
                    aria-label="Ajouter depuis le catalogue"
                    value=""
                    onChange={(e) => {
                      const item = catalog.data?.items.find(
                        (i) => i.id === e.target.value,
                      );
                      if (item) {
                        setLines((v) => [
                          ...v,
                          {
                            description: item.description || item.name,
                            quantity: "1",
                            price:
                              item.unit_price_cents === null
                                ? ""
                                : centsInput(item.unit_price_cents),
                            discount: "0",
                          },
                        ]);
                        setDirty(true);
                      }
                    }}
                  >
                    <option value="">Ajouter depuis le catalogue</option>
                    {catalog.data?.items
                      .filter((i) => i.active)
                      .map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="quote-lines">
                  {lines.map((line, index) => (
                    <fieldset key={index}>
                      <legend>Prestation {index + 1}</legend>
                      <div>
                        <label
                          className="field-label"
                          htmlFor={`line-${index}-description`}
                        >
                          Description
                        </label>
                        <textarea
                          id={`line-${index}-description`}
                          className="studio-input"
                          value={line.description}
                          onChange={(e) =>
                            lineChange(index, "description", e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                      <div className="line-numbers">
                        {(
                          [
                            ["quantity", "Quantité"],
                            ["price", "Prix unitaire (DH)"],
                            ["discount", "Remise (%)"],
                          ] as const
                        ).map(([key, label]) => (
                          <div key={key}>
                            <label
                              className="field-label"
                              htmlFor={`line-${index}-${key}`}
                            >
                              {label}
                            </label>
                            <input
                              id={`line-${index}-${key}`}
                              className="studio-input"
                              inputMode="decimal"
                              value={line[key]}
                              onChange={(e) =>
                                lineChange(index, key, e.target.value)
                              }
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="remove-line"
                          aria-label={`Retirer la prestation ${index + 1}`}
                          disabled={lines.length === 1}
                          onClick={() => {
                            setLines((v) => v.filter((_, i) => i !== index));
                            setDirty(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </fieldset>
                  ))}
                </div>
                <button
                  className="text-link"
                  onClick={() => {
                    setLines((v) => [
                      ...v,
                      {
                        description: "",
                        quantity: "1",
                        price: "",
                        discount: "0",
                      },
                    ]);
                    setDirty(true);
                  }}
                  disabled={lines.length >= 60}
                >
                  <Plus size={16} />
                  Ajouter une prestation
                </button>
                <div className="quote-total">
                  <p>
                    Traitement fiscal :{" "}
                    <strong>
                      {settings.data?.tax_configured
                        ? settings.data.tax_mode === "standard"
                          ? `${settings.data.tax_bps / 100} %`
                          : settings.data.tax_mode === "exempt"
                            ? "Exonération configurée"
                            : "Non applicable (configuré)"
                        : "À configurer par le propriétaire"}
                    </strong>
                  </p>
                  <p>
                    Sous-total après remises{" "}
                    <span>
                      {total
                        ? formatMoney(total.subtotal_cents)
                        : "À compléter"}
                    </span>
                  </p>
                  <p>
                    Taxes{" "}
                    <span>{total ? formatMoney(total.tax_cents) : "—"}</span>
                  </p>
                  <strong>
                    Total du brouillon{" "}
                    <span>
                      {total ? formatMoney(total.total_cents) : "À compléter"}
                    </span>
                  </strong>
                  <small>
                    Calcul indicatif du brouillon. Les montants définitifs sont
                    recalculés et figés par le serveur.
                  </small>
                </div>
              </section>
              <section className="studio-panel">
                <div className="form-fields">
                  <div className="field-full">
                    <label className="field-label" htmlFor="quote-terms">
                      Conditions de paiement
                    </label>
                    <textarea
                      id="quote-terms"
                      className="studio-input"
                      rows={4}
                      value={terms}
                      onChange={(e) => change(setTerms, e.target.value)}
                    />
                  </div>
                  <div className="field-full">
                    <label className="field-label" htmlFor="quote-notes">
                      Notes et précisions
                    </label>
                    <textarea
                      id="quote-notes"
                      className="studio-input"
                      rows={3}
                      value={notes}
                      onChange={(e) => change(setNotes, e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="platform-button"
                  onClick={save}
                  disabled={busy}
                >
                  Enregistrer le brouillon <Check size={15} />
                </button>
              </section>
            </>
          ) : issued ? (
            <section className="studio-panel">
              <div className="panel-title">
                <h2>Version émise, conservée sans modification</h2>
                <select
                  className="studio-input catalogue-select"
                  aria-label="Version du devis"
                  value={versionId}
                  onChange={(e) => setVersionId(e.target.value)}
                >
                  {q.data?.versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      Révision {v.version} · {date(v.created_at)}
                    </option>
                  ))}
                </select>
              </div>
              <h3>{issued.title}</h3>
              <p>{issued.description}</p>
              <p>
                Client : {issued.client.full_name} ·{" "}
                {issued.client.company_name}
              </p>
              <div className="records-table">
                <table>
                  <thead>
                    <tr>
                      <th>Prestation</th>
                      <th>Quantité</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issued.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{formatMoney(item.net_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="quote-total">
                <strong>
                  Total MAD <span>{formatMoney(issued.total_cents)}</span>
                </strong>
              </div>
              <p>
                Validité : {date(issued.expires_on)} · {issued.payment_terms}
              </p>
            </section>
          ) : null}
          {id && (
            <section className="studio-panel">
              <h2>Documents et validation</h2>
              <div className="studio-actions">
                <button
                  className="platform-button secondary"
                  disabled={busy || dirty}
                  onClick={() =>
                    action(async () => {
                      const blob = await api<Blob>(
                        `admin/quotes/${id}/preview`,
                        { method: "POST", data: {}, raw: true },
                      );
                      if (preview) URL.revokeObjectURL(preview);
                      setPreview(URL.createObjectURL(blob));
                    })
                  }
                >
                  <FileText size={15} />
                  Générer un aperçu
                </button>
                {preview && (
                  <a
                    className="text-link"
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ouvrir l’aperçu PDF <ArrowUpRight size={15} />
                  </a>
                )}
                {!draft && versionId && (
                  <button
                    className="platform-button secondary"
                    disabled={busy}
                    onClick={() =>
                      action(async () => {
                        const result = await api<{ url: string }>(
                          `admin/quotes/${id}/pdf`,
                          { method: "POST", data: { versionId } },
                        );
                        window.location.assign(result.url);
                      })
                    }
                  >
                    <Download size={15} />
                    Télécharger cette version
                  </button>
                )}
              </div>
              {draft ? (
                <>
                  <p className="form-note">
                    Enregistrez vos dernières modifications. La finalisation
                    fige les prestations, montants, conditions et informations
                    de l’agence dans une nouvelle version.
                  </p>
                  <label className="check-option">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    <span>
                      J’ai vérifié le client, les prix, la fiscalité et les
                      conditions de ce devis.
                    </span>
                  </label>
                  <button
                    className="platform-button"
                    disabled={!confirmed || dirty || busy}
                    onClick={() =>
                      action(async () => {
                        await api(`admin/quotes/${id}/finalize`, {
                          method: "POST",
                          data: { revision: q.data?.revision, confirm: true },
                        });
                        await cache.invalidateQueries({
                          queryKey: ["quote", id],
                        });
                        setNotice(
                          "Version du devis finalisée et conservée. Aucun email n’a été envoyé.",
                        );
                      })
                    }
                  >
                    Finaliser cette version
                  </button>
                </>
              ) : (
                <>
                  <div className="studio-actions">
                    {["finalized", "sent"].includes(q.data?.status ?? "") && (
                      <button
                        className="platform-button"
                        disabled={busy}
                        onClick={() => quoteAction("send")}
                      >
                        <Send size={15} />
                        Programmer l’envoi au client
                      </button>
                    )}
                    {["finalized", "sent", "rejected", "expired"].includes(
                      q.data?.status ?? "",
                    ) && (
                      <button
                        className="platform-button secondary"
                        disabled={busy}
                        onClick={() => quoteAction("revision")}
                      >
                        <RefreshCw size={15} />
                        Créer une révision
                      </button>
                    )}
                  </div>
                  <label className="field-label" htmlFor="quote-decision">
                    Justificatif ou note de suivi
                  </label>
                  <textarea
                    id="quote-decision"
                    className="studio-input"
                    rows={3}
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    placeholder="Par exemple : référence de l’accord écrit reçu du client…"
                  />
                  <div className="studio-actions">
                    {["finalized", "sent"].includes(q.data?.status ?? "") && (
                      <>
                        <button
                          className="platform-button secondary"
                          disabled={busy || decision.trim().length < 3}
                          onClick={() => quoteAction("accepted")}
                        >
                          Enregistrer l’acceptation
                        </button>
                        <button
                          className="text-link danger"
                          disabled={busy || decision.trim().length < 3}
                          onClick={() => quoteAction("rejected")}
                        >
                          Enregistrer le refus
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </section>
          )}
          {id && Boolean(q.data?.versions.length) && (
            <section className="studio-panel">
              <h2>Versions conservées</h2>
              {q.data?.versions.map((v) => (
                <div className="history-link" key={v.id}>
                  <span>
                    {v.snapshot.reference} · Révision {v.version} ·{" "}
                    {date(v.created_at)}
                  </span>
                  <button
                    className="text-link"
                    disabled={busy}
                    onClick={() =>
                      action(async () => {
                        const r = await api<{ url: string }>(
                          `admin/quotes/${id}/pdf`,
                          { method: "POST", data: { versionId: v.id } },
                        );
                        window.location.assign(r.url);
                      })
                    }
                  >
                    PDF <Download size={14} />
                  </button>
                </div>
              ))}
            </section>
          )}
          {id && q.data && (
            <section className="studio-panel">
              <h2>Historique et livraison</h2>
              <p className="form-note">
                La mise en file, l’acceptation par le prestataire et la
                livraison sont des états distincts. Une livraison ne confirme
                pas la lecture.
              </p>
              {q.data.delivery?.jobs.map((job, i) => (
                <p key={i}>
                  Envoi :{" "}
                  {
                    (
                      {
                        pending: "En attente de traitement",
                        working: "En cours",
                        done: "Traité par le prestataire",
                        failed: "Échec à examiner",
                        unknown: "Vérification manuelle requise",
                      } as Record<string, string>
                    )[job.status]
                  }
                  {job.last_error ? " · Intervention nécessaire" : ""}
                </p>
              ))}
              {q.data.delivery?.events.map((event, i) => (
                <p key={i}>
                  {event.event_type === "email.delivered"
                    ? "Livré au serveur du destinataire"
                    : event.event_type === "email.bounced"
                      ? "Rejeté par le serveur destinataire"
                      : event.event_type === "email.sent"
                        ? "Accepté pour acheminement"
                        : "Événement du prestataire"}{" "}
                  · {date(event.occurred_at)}
                </p>
              ))}
              <ol className="event-list">
                {q.data.events.map((event) => (
                  <li key={event.id}>
                    <span>{date(event.created_at)}</span>
                    <strong>
                      {statusLabels[event.event_type] ??
                        (
                          {
                            finalized: "Finalisation",
                            revision: "Nouvelle révision",
                            send: "Mise en file",
                            email_accepted: "Accepté par le prestataire",
                          } as Record<string, string>
                        )[event.event_type] ??
                        event.event_type}
                    </strong>
                    <p>{event.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}
      <ErrorBox error={error ? new Error(error) : null} />
      {notice && (
        <p className="platform-notice" role="status">
          {notice}
        </p>
      )}
    </>
  );
}
export function SettingsPage() {
  const q = useQuery({
      queryKey: ["settings"],
      queryFn: () => api<SettingsData>("admin/settings"),
    }),
    cache = useQueryClient();
  const [v, setV] = useState<SettingsData | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (q.data) setV(q.data);
  }, [q.data]);
  const labels: Record<string, string> = {
    name: "Nom de l’agence",
    email: "Email public",
    phone: "Téléphone",
    city: "Ville",
    address: "Adresse légale vérifiée",
    ice: "ICE",
    tax_id: "Identifiant fiscal (IF)",
    rc: "Registre de commerce (RC)",
    cnss: "CNSS",
    tax_note: "Mention fiscale vérifiée",
    payment_terms: "Conditions de paiement par défaut",
    acceptance_instructions: "Instructions d’acceptation",
    privacy_notice: "Notice de confidentialité complète",
  };
  return (
    <>
      <Title
        eyebrow="Configuration de l’agence"
        title="Des informations justes, toujours."
      />
      <ErrorBox error={q.error} />
      {v && (
        <form
          className="studio-panel"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            setNotice("");
            try {
              const keys = Object.keys(agencySchema.shape);
              const payload = Object.fromEntries(
                keys.map((k) => [k, v[k as keyof SettingsData]]),
              );
              await api("admin/settings", { method: "PATCH", data: payload });
              await cache.invalidateQueries({ queryKey: ["settings"] });
              setNotice("Configuration enregistrée.");
            } catch (x) {
              setError(message(x));
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="platform-notice">
            Ne renseignez que des informations vérifiées. Aucun identifiant
            légal, taux fiscal ou statut d’exonération n’est présumé. Ces
            réglages ne remplacent pas une validation professionnelle des
            obligations applicables.
          </p>
          <div className="form-fields">
            {Object.entries(labels).map(([key, label]) => (
              <div
                key={key}
                className={
                  [
                    "privacy_notice",
                    "payment_terms",
                    "acceptance_instructions",
                    "tax_note",
                  ].includes(key)
                    ? "field-full"
                    : ""
                }
              >
                <label className="field-label" htmlFor={`setting-${key}`}>
                  {label}
                </label>
                {[
                  "privacy_notice",
                  "payment_terms",
                  "acceptance_instructions",
                  "tax_note",
                ].includes(key) ? (
                  <textarea
                    className="studio-input"
                    id={`setting-${key}`}
                    rows={key === "privacy_notice" ? 12 : 4}
                    value={String(v[key as keyof SettingsData] ?? "")}
                    onChange={(e) => setV({ ...v, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    className="studio-input"
                    id={`setting-${key}`}
                    value={String(v[key as keyof SettingsData] ?? "")}
                    onChange={(e) => setV({ ...v, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
            <div>
              <label className="field-label" htmlFor="tax-mode">
                Traitement fiscal applicable
              </label>
              <select
                className="studio-input"
                id="tax-mode"
                value={v.tax_mode}
                onChange={(e) =>
                  setV({
                    ...v,
                    tax_mode: e.target.value as SettingsData["tax_mode"],
                    tax_bps: 0,
                  })
                }
              >
                {[
                  ["unconfigured", "Non configuré"],
                  ["standard", "Taux vérifié"],
                  ["exempt", "Exonération vérifiée"],
                  ["not_applicable", "Non applicable (vérifié)"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="tax-rate">
                Taux en %
              </label>
              <input
                id="tax-rate"
                className="studio-input"
                type="number"
                min={0}
                max={100}
                step={0.01}
                disabled={v.tax_mode !== "standard"}
                value={v.tax_bps / 100}
                onChange={(e) =>
                  setV({
                    ...v,
                    tax_bps: Math.round(Number(e.target.value) * 100),
                  })
                }
              />
            </div>
            <div>
              <label className="field-label" htmlFor="retention">
                Conservation des demandes non retenues (jours)
              </label>
              <input
                className="studio-input"
                id="retention"
                type="number"
                min={1}
                max={3650}
                value={v.retention_days ?? ""}
                onChange={(e) =>
                  setV({
                    ...v,
                    retention_days: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
              <p className="form-note">
                À fixer selon votre politique vérifiée. Les documents
                commerciaux émis restent protégés et nécessitent un examen
                distinct.
              </p>
            </div>
            <div className="field-full">
              {(
                [
                  [
                    "legal_verified",
                    "J’ai vérifié les informations officielles de l’agence.",
                  ],
                  [
                    "tax_configured",
                    "Le traitement fiscal a été vérifié pour cette activité.",
                  ],
                  [
                    "privacy_verified",
                    "La notice, les formalités applicables et la durée de conservation ont été validées. Ouvrir la collecte.",
                  ],
                  [
                    "confirmation_emails",
                    "Activer les emails de confirmation aux clients.",
                  ],
                ] as const
              ).map(([key, label]) => (
                <label className="check-option" key={key}>
                  <input
                    type="checkbox"
                    checked={v[key]}
                    onChange={(e) => setV({ ...v, [key]: e.target.checked })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <ErrorBox error={error ? new Error(error) : null} />
          <button className="platform-button" disabled={busy}>
            Enregistrer la configuration
          </button>
          {notice && <p role="status">{notice}</p>}
        </form>
      )}
    </>
  );
}
export function CatalogEditor() {
  const { id } = useParams(),
    cache = useQueryClient();
  const q = useQuery({
    queryKey: ["catalog", id],
    queryFn: () =>
      api<{
        name: string;
        description: string;
        unit_price_cents: number | null;
        active: boolean;
      }>(`admin/pricing/${id}`),
    enabled: Boolean(id),
  });
  const [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [price, setPrice] = useState(""),
    [active, setActive] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (q.data) {
      setName(q.data.name);
      setDescription(q.data.description);
      setPrice(
        q.data.unit_price_cents === null
          ? ""
          : centsInput(q.data.unit_price_cents),
      );
      setActive(q.data.active);
    }
  }, [q.data]);
  return (
    <>
      <Title
        eyebrow="Catalogue interne"
        title={id ? "Modifier la prestation" : "Ajouter une prestation"}
      />
      <ErrorBox error={q.error} />
      <form
        className="studio-panel"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            await api(id ? `admin/pricing/${id}` : "admin/pricing", {
              method: id ? "PATCH" : "POST",
              data: {
                name,
                description,
                unit_price_cents: price ? decimalToCents(price) : null,
                active,
              },
            });
            setNotice(
              "Prestation enregistrée. Les packages publics restent inchangés.",
            );
            await cache.invalidateQueries({ queryKey: ["pricing"] });
          } catch (x) {
            setError(message(x));
          }
        }}
      >
        {[
          ["name", "Nom", name, setName],
          ["description", "Description", description, setDescription],
          ["price", "Prix unitaire DH (facultatif)", price, setPrice],
        ].map(([key, label, value, set]) => (
          <div key={key as string}>
            <label className="field-label" htmlFor={`catalog-${key}`}>
              {label as string}
            </label>
            <input
              className="studio-input"
              id={`catalog-${key}`}
              value={value as string}
              onChange={(e) => (set as (v: string) => void)(e.target.value)}
            />
          </div>
        ))}
        <label className="check-option">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Proposer cette prestation
        </label>
        <ErrorBox error={error ? new Error(error) : null} />
        <button className="platform-button">Enregistrer</button>
        {notice && <p role="status">{notice}</p>}
      </form>
    </>
  );
}
export function Catalog() {
  return (
    <>
      <Link className="platform-button" to="/admin/catalogue/nouveau">
        <Plus size={16} />
        Ajouter une prestation
      </Link>
      <Records kind="pricing" />
    </>
  );
}
export function ProjectDetail() {
  const { id } = useParams();
  const q = useQuery({
    queryKey: ["project", id],
    queryFn: () =>
      api<{
        title: string;
        status: string;
        notes: string;
        starts_on: string | null;
        delivery_on: string | null;
      }>(`admin/projects/${id}`),
  });
  const [v, setV] = useState<{
      title: string;
      status: string;
      notes: string;
      starts_on: string | null;
      delivery_on: string | null;
    } | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (q.data) setV(q.data);
  }, [q.data]);
  return (
    <>
      <Title eyebrow="Suivi de réalisation" title={v?.title ?? "Projet"} />
      <ErrorBox error={q.error} />
      {v && (
        <form
          className="studio-panel"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              await api(`admin/projects/${id}`, {
                method: "PATCH",
                data: {
                  status: v.status,
                  notes: v.notes,
                  starts_on: v.starts_on,
                  delivery_on: v.delivery_on,
                },
              });
              setNotice("Suivi du projet enregistré.");
            } catch (x) {
              setError(message(x));
            }
          }}
        >
          <label className="field-label" htmlFor="project-status">
            Statut
          </label>
          <select
            className="studio-input"
            id="project-status"
            value={v.status}
            onChange={(e) => setV({ ...v, status: e.target.value })}
          >
            {["planned", "active", "on_hold", "completed", "cancelled"].map(
              (s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ),
            )}
          </select>
          {(
            [
              ["starts_on", "Date de démarrage"],
              ["delivery_on", "Livraison prévue"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="field-label" htmlFor={key}>
                {label}
              </label>
              <input
                className="studio-input"
                type="date"
                id={key}
                value={v[key] ?? ""}
                onChange={(e) => setV({ ...v, [key]: e.target.value || null })}
              />
            </div>
          ))}
          <label className="field-label" htmlFor="project-notes">
            Notes de suivi
          </label>
          <textarea
            className="studio-input"
            rows={5}
            id="project-notes"
            value={v.notes}
            onChange={(e) => setV({ ...v, notes: e.target.value })}
          />
          <ErrorBox error={error ? new Error(error) : null} />
          <button className="platform-button">Enregistrer</button>
          {notice && <p role="status">{notice}</p>}
        </form>
      )}
    </>
  );
}
