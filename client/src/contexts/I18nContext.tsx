import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en } from "@/i18n/locales/en";
import { th, type Dict } from "@/i18n/locales/th";
import { storage, StorageKeys } from "@/lib/storage";

export type Language = "th" | "en";
export type TKey = keyof Dict;
export type TFn = (key: TKey, vars?: Record<string, string | number>) => string;

const dictionaries: Record<Language, Dict> = { th, en };
const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: TFn;
}

const initialLang = (): Language => {
  const saved = storage.get(StorageKeys.language);

  if (saved === "th" || saved === "en") return saved;

  return navigator.language?.toLowerCase().startsWith("th") ? "th" : "en";
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(initialLang);

  useEffect(() => {
    document.documentElement.lang = language;
    storage.set(StorageKeys.language, language);
  }, [language]);

  const t = useCallback<TFn>(
    (key, vars) => {
      let s: string = dictionaries[language][key] ?? key;
      if (vars)
        for (const [k, v] of Object.entries(vars))
          s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);

  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");

  return ctx;
};
