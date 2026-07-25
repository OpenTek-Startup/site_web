import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../../../i18n/useLangPath";
import { Seo } from "../../../components/seo/Seo";
import "./notFound.css";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const langPath = useLangPath();

  return (
    <div className="not-found">
      <Seo title="404" noindex />
      <h1>404</h1>
      <p>{t("notFoundPage.text")}</p>
      <Link to={langPath("/")}>{t("notFoundPage.backHome")}</Link>
    </div>
  );
}
