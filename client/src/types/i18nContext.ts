import type { ReactNode } from 'react';
import type { Language } from '@/enums';
import type { th } from '@/i18n/locales/th';

export type Dict = Record<keyof typeof th, string>;

export type TKey = keyof Dict;

export type TVars = Record<string, string | number>;

export type TFn = (key: TKey, vars?: TVars) => string;

export interface I18nContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: TFn;
}

export interface I18nProviderProps {
    children: ReactNode;
}
