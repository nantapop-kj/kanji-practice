import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Context, type JSX } from 'react';
import { Language, Languages, StorageKey } from '@/enums';
import { en, th } from '@/i18n';
import { storage } from '@/lib';
import type { Dict, I18nContextValue, I18nProviderProps, TFn, TKey, TVars } from '@/types';

const Dictionaries: Record<Language, Dict> = {
    [Language.Th]: th,
    [Language.En]: en,
};

const I18nContext: Context<I18nContextValue | null> = createContext<I18nContextValue | null>(null);

const initialLanguage = (): Language => {
    const saved: string | null = storage.get(StorageKey.Language);

    if (Languages.includes(saved as Language)) return saved as Language;

    return navigator.language?.toLowerCase().startsWith(Language.Th) ? Language.Th : Language.En;
};

export const I18nProvider = ({ children }: I18nProviderProps): JSX.Element => {
    const [language, setLanguage] = useState<Language>(initialLanguage);

    useEffect((): void => {
        document.documentElement.lang = language;
        storage.set(StorageKey.Language, language);
    }, [language]);

    const t = useCallback<TFn>(
        (key: TKey, vars?: TVars): string => {
            let s: string = Dictionaries[language][key] ?? key;
            if (vars) {
                for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
            }
            return s;
        },
        [language],
    );

    const value = useMemo((): I18nContextValue => ({ language, setLanguage, t }), [language, t]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
    const ctx: I18nContextValue | null = useContext(I18nContext);

    if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');

    return ctx;
};
