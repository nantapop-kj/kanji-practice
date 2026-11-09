import { useI18n, type Language } from "@/i18n";
import "./LanguageToggle.css";

const Options: [Language, string, string][] = [
  ["th", "TH", "ภาษาไทย"],
  ["en", "EN", "English"],
];

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="pill-toggle" role="group" aria-label={t("language")}>
      {Options.map(([l, short, full]) => (
        <button
          key={l}
          className="pill-text"
          aria-pressed={language === l}
          title={full}
          onClick={() => setLanguage(l)}
        >
          {short}
        </button>
      ))}
    </div>
  );
};
