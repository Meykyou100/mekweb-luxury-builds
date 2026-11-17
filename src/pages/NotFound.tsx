import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
const NotFound = () => (
  <main className="not-found">
    <a href="/" aria-label="MekWeb — Accueil">
      <BrandLogo />
    </a>
    <p className="eyebrow">Erreur 404</p>
    <h1>
      Une page
      <br />
      <em>à retrouver.</em>
    </h1>
    <p>Cette page n’existe pas ou a été déplacée.</p>
    <a className="text-link" href="/">
      <ArrowLeft size={17} /> Retour à l’accueil
    </a>
  </main>
);
export default NotFound;
