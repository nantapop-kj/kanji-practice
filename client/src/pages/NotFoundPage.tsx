import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { Paths } from "@/routes/paths";
import "./NotFoundPage.css";

export const NotFoundPage = () => {
  const { t } = useI18n();

  return (
    <main className="card not-found">
      <div className="not-found-kanji" lang="ja" aria-hidden="true">
        迷
      </div>
      <span className="badge">404</span>
      <h2>{t("notFoundTitle")}</h2>
      <p className="hint">{t("notFoundBody")}</p>
      <Link className="btn" to={Paths.home}>
        {t("notFoundCta")}
      </Link>
    </main>
  );
};
