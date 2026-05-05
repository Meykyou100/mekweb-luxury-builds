import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/site/BrandLogo";

const PRELOADER_ENABLED = true;
const PRELOADER_DURATION_MS = 2100;
const PRELOADER_FADE_MS = 450;
const PRELOADER_STORAGE_KEY = "mekweb-preloader-seen";

export const Preloader = () => {
  const [visible, setVisible] = useState(() => {
    if (!PRELOADER_ENABLED || typeof window === "undefined") return false;
    return sessionStorage.getItem(PRELOADER_STORAGE_KEY) !== "true";
  });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    sessionStorage.setItem(PRELOADER_STORAGE_KEY, "true");

    const fadeTimer = window.setTimeout(() => {
      setLeaving(true);
    }, PRELOADER_DURATION_MS);

    const removeTimer = window.setTimeout(() => {
      setVisible(false);
    }, PRELOADER_DURATION_MS + PRELOADER_FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`preloader fixed inset-0 z-[9999] grid place-items-center bg-black text-white ${
        leaving ? "preloader-leaving" : ""
      }`}
      role="status"
      aria-label="Loading MekWeb Agency"
    >
      <div className="preloader-glow" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-7">
        <BrandLogo
          className="preloader-logo"
          markClassName="h-16 w-16 border-0 bg-transparent sm:h-20 sm:w-20"
          textClassName="text-3xl sm:text-4xl"
        />
        <div className="preloader-line" aria-hidden="true">
          <span />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.36em] text-yellow-300/85">
          Premium Web Agency
        </p>
      </div>
    </div>
  );
};
