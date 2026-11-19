import { useEffect, useRef } from "react";
interface Turnstile {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let scriptPromise: Promise<void> | undefined;
function loadScript() {
  return (scriptPromise ??= new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = undefined;
      reject(new Error("La vérification de sécurité n’a pas pu être chargée."));
    };
    document.head.appendChild(script);
  }));
}
export function Challenge({
  onToken,
  resetKey = 0,
}: {
  onToken: (value: string) => void;
  resetKey?: number;
}) {
  const root = useRef<HTMLDivElement>(null),
    callback = useRef(onToken);
  callback.current = onToken;
  useEffect(() => {
    let id: string | undefined,
      cancelled = false;
    callback.current("");
    if (!import.meta.env.VITE_TURNSTILE_SITE_KEY) return;
    loadScript()
      .then(() => {
        if (cancelled || !root.current || !window.turnstile) return;
        id = window.turnstile.render(root.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          action: "quotation",
          theme: "dark",
          callback: (t: string) => callback.current(t),
          "expired-callback": () => callback.current(""),
          "error-callback": () => callback.current(""),
        });
      })
      .catch(() => {
        if (root.current)
          root.current.textContent =
            "Vérification indisponible. Rechargez la page pour réessayer.";
      });
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, [resetKey]);
  return (
    <div className="challenge">
      <div ref={root} />
      {!import.meta.env.VITE_TURNSTILE_SITE_KEY && (
        <p className="form-note">
          L’envoi en ligne n’est pas encore activé. Vous pouvez nous contacter
          directement.
        </p>
      )}
    </div>
  );
}
