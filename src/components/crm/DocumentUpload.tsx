import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { api } from "@/lib/platform-api";
import { Challenge } from "./Challenge";
export type UploadResult = { ids: string[]; capability: string };
export function DocumentUpload({
  sessionKey,
  consent,
  onReady,
  onReset,
}: {
  sessionKey: string;
  consent: boolean;
  onReady: (value: UploadResult | null) => void;
  onReset: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]),
    [token, setToken] = useState(""),
    [cap, setCap] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [reset, setReset] = useState(0);
  async function check(capability: string) {
    const result = await api<{
      documents: { id: string; scan_status: string }[];
    }>("uploads/complete", {
      method: "POST",
      data: { idempotencyKey: sessionKey, capability },
    });
    if (
      result.documents.some((d) =>
        ["infected", "failed"].includes(d.scan_status),
      )
    )
      throw new Error(
        "Un document ne peut pas être accepté. Retirez les pièces jointes pour poursuivre.",
      );
    if (
      result.documents.length === files.length &&
      result.documents.every((d) => d.scan_status === "clean")
    ) {
      onReady({ ids: result.documents.map((d) => d.id), capability });
      setMessage("Documents vérifiés et prêts à joindre.");
    } else
      setMessage(
        "Documents transférés. Leur vérification de sécurité est en cours. Cliquez sur « Vérifier » dans quelques instants.",
      );
  }
  async function upload() {
    setBusy(true);
    setMessage("");
    try {
      if (cap) {
        await check(cap);
        return;
      }
      const result = await api<{
        capability: string;
        tickets: { id: string; url: string }[];
      }>("uploads/tickets", {
        method: "POST",
        data: {
          idempotencyKey: sessionKey,
          challengeToken: token,
          consent: true,
          files: files.map((f) => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })),
        },
      });
      setCap(result.capability);
      await Promise.all(
        result.tickets.map(async (t, i) => {
          const r = await fetch(t.url, {
            method: "PUT",
            headers: { "Content-Type": files[i].type },
            body: files[i],
          });
          if (!r.ok)
            throw new Error(
              "Le transfert a échoué. Retirez les pièces jointes pour réessayer.",
            );
        }),
      );
      await check(result.capability);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Transfert indisponible.");
    } finally {
      setBusy(false);
      setReset((n) => n + 1);
    }
  }
  function clear() {
    setFiles([]);
    setCap("");
    setMessage("");
    onReady(null);
    onReset();
  }
  return (
    <div className="upload-box">
      <label className="field-label" htmlFor="supporting-files">
        Documents utiles <span>(facultatif)</span>
      </label>
      <p className="form-note">
        PDF, JPG ou PNG. Trois fichiers maximum, 5 Mo par fichier. Évitez les
        pièces d’identité et les données sensibles.
      </p>
      {!files.length ? (
        <label className="upload-select">
          <Upload size={20} />
          <span>Choisir mes documents</span>
          <input
            id="supporting-files"
            type="file"
            multiple
            accept="application/pdf,image/jpeg,image/png"
            onChange={(e) => {
              const value = Array.from(e.target.files ?? []);
              if (
                value.length > 3 ||
                value.some(
                  (f) =>
                    f.size > 5242880 ||
                    !["application/pdf", "image/jpeg", "image/png"].includes(
                      f.type,
                    ),
                )
              ) {
                setMessage(
                  "Choisissez au plus trois PDF/JPG/PNG de 5 Mo chacun.",
                );
                return;
              }
              setFiles(value);
              onReady(null);
            }}
          />
        </label>
      ) : (
        <>
          <div className="upload-files">
            {files.map((f) => (
              <span key={f.name}>
                <FileText size={15} />
                {f.name}
              </span>
            ))}
            <button
              type="button"
              className="text-link"
              onClick={clear}
              disabled={busy}
            >
              <X size={14} />
              Retirer les documents
            </button>
          </div>
          {!cap && consent && <Challenge onToken={setToken} resetKey={reset} />}
          <button
            type="button"
            className="platform-button secondary"
            disabled={busy || !consent || (!cap && !token)}
            onClick={upload}
          >
            {busy
              ? "Vérification…"
              : cap
                ? "Vérifier les documents"
                : "Transférer les documents"}
          </button>
          {!consent && (
            <p className="form-note">
              Prenez connaissance de la notice avant le transfert.
            </p>
          )}
        </>
      )}
      {message && (
        <p role="status" className="form-note">
          {message}
        </p>
      )}
    </div>
  );
}
