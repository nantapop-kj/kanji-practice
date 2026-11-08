import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n, type TKey } from "@/i18n";
import { Paths } from "@/routes/paths";
import "./LandingPage.css";

const Features: { kanji: string; title: TKey; body: TKey }[] = [
  { kanji: "読", title: "featureQuizTitle", body: "featureQuizBody" },
  { kanji: "弱", title: "featureWeakTitle", body: "featureWeakBody" },
  { kanji: "級", title: "featureLevelTitle", body: "featureLevelBody" },
];
const SampleChoices = ["がくせい", "べんきょう", "せんせい", "きょうしつ"];
const SampleAnswer = "べんきょう";

export const LandingPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <main className="landing">
      <section className="landing-hero">
        <div>
          <span className="badge">JLPT N5–N1</span>
          <h2>{t("heroTitle")}</h2>
          <p className="landing-lead">{t("heroLead")}</p>
          <Link className="btn landing-cta" to={user ? Paths.quiz : Paths.login}>
            {t("heroCta")}
          </Link>
        </div>
        <div className="card landing-sample" aria-hidden="true">
          <div className="hint">{t("sampleLabel")}</div>
          <div className="landing-sample-kanji" lang="ja">
            勉強
          </div>
          <div className="landing-sample-choices" lang="ja">
            {SampleChoices.map((choice) => (
              <div
                key={choice}
                className={choice === SampleAnswer ? "is-correct" : undefined}
              >
                {choice}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="landing-features">
        {Features.map((feature) => (
          <article key={feature.title} className="card">
            <div className="landing-feature-kanji" lang="ja" aria-hidden="true">
              {feature.kanji}
            </div>
            <h3>{t(feature.title)}</h3>
            <p className="hint">{t(feature.body)}</p>
          </article>
        ))}
      </section>
    </main>
  );
};
