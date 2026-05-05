import { useEffect, useState } from "react";
import agencyMark from "@/assets/agency-mark.png";

const PRELOADER_ENABLED = true;
const PRELOADER_DURATION_MS = 2800;
const PRELOADER_FADE_MS = 550;

export const Preloader = () => {
  const [visible, setVisible] = useState(PRELOADER_ENABLED);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => {
      setLeaving(true);
    }, PRELOADER_DURATION_MS);

    const removeTimer = window.setTimeout(() => {
      setVisible(false);
    }, PRELOADER_DURATION_MS + PRELOADER_FADE_MS);

    return () => {
      document.body.style.overflow = previousOverflow;
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
      <div className="preloader-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="preloader-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="preloader-content relative flex flex-col items-center">
        <div className="preloader-brand" aria-hidden="true">
          <span className="preloader-mark">
            <img src={agencyMark} alt="" />
          </span>
          <span className="preloader-wordmark">
            <span className="preloader-name">MekWeb</span>
            <span className="preloader-agency">Agency</span>
          </span>
        </div>

        <div className="preloader-line" aria-hidden="true">
          <span />
        </div>

        <p className="preloader-subtitle">
          Création de sites web professionnels
        </p>
      </div>
    </div>
  );
};
