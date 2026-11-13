import type { TKey } from './i18nContext';

export type WordField = 'kanji' | 'reading' | 'meaningsTh' | 'meaningsEn';

export type WordFieldErrors = Partial<Record<WordField, TKey>>;

export interface WordDraft {
    kanji: string;
    reading: string;
    meaningsTh: string[];
    meaningsEn: string[];
}
