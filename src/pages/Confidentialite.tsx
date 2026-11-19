import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BrandLogo } from "@/components/site/BrandLogo";
import { api, type PublicConfig } from "@/lib/platform-api";
import "@/platform.css";
export default function Confidentialite() {
  const config = useQuery({
    queryKey: ["public-config"],
    queryFn: () => api<PublicConfig>("public/config"),
    retry: false,
  });
  return (
    <div className="platform-public">
      <header className="brief-header container-luxe">
        <Link to="/">
          <BrandLogo />
        </Link>
        <Link to="/devis" className="text-link">
          Votre projet
        </Link>
      </header>
      <main className="privacy-page container-luxe">
        <p className="eyebrow">Vos informations</p>
        <h1>
          Notice de <em>confidentialité.</em>
        </h1>
        {config.data?.agency?.privacy_verified ? (
          <>
            <p className="form-note">
              Version publiée : {config.data.agency.privacy_notice_version}
            </p>
            <div className="notice-text">
              {config.data.agency.privacy_notice}
            </div>
          </>
        ) : (
          <div className="platform-notice">
            <p>
              La notice relative à la demande de devis en ligne n’est pas encore
              publiée. L’enregistrement des demandes reste désactivé.
            </p>
            <p>
              Pour échanger au sujet de votre projet ou de vos informations,
              contactez{" "}
              <a href="mailto:mekwebagency@gmail.com">mekwebagency@gmail.com</a>
              .
            </p>
          </div>
        )}
        <Link to="/" className="platform-button secondary">
          Retour au studio
        </Link>
      </main>
    </div>
  );
}
