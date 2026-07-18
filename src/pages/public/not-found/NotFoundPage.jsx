import { Link } from "react-router-dom";
import { useLangPath } from "../../../i18n/useLangPath";
import { Seo } from "../../../components/seo/Seo";
import "./notFound.css";

export default function NotFoundPage() {
  const langPath = useLangPath();

  return (
    <div className="not-found">
      <Seo title="Page introuvable" noindex />
      <h1>404</h1>
      <p>Cette page n&apos;existe pas ou plus.</p>
      <Link to={langPath("/")}>Retour a l&apos;accueil</Link>
    </div>
  );
}
