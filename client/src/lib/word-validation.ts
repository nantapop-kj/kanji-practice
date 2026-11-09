import type { TKey } from '@/i18n';

const KanjiMaxLength = 50;
const ReadingMaxLength = 100;
const MeaningMaxLength = 255;
const MeaningMaxItems = 20;

const JapaneseRegex = /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー・〜]+$/u;
const KanaRegex = /^[\p{Script=Hiragana}\p{Script=Katakana}ー・\s]+$/u;
const ThaiRegex = /^[\p{Script=Thai}0-9\s().,'"!?~\-]+$/u;
const HasThai = /\p{Script=Thai}/u;
const EnglishRegex = /^[A-Za-z0-9\s().,'"!?~;:&\-]+$/;
const HasEnglish = /[A-Za-z]/;

export type WordField = 'kanji' | 'reading' | 'meaningsTh' | 'meaningsEn';
export type WordFieldErrors = Partial<Record<WordField, TKey>>;

export interface WordDraft {
    kanji: string;
    reading: string;
    meaningsTh: string[];
    meaningsEn: string[];
}

const meaningsValid = (meanings: string[], pattern: RegExp, required: RegExp): boolean =>
    meanings.every((m) => m.length <= MeaningMaxLength && pattern.test(m) && required.test(m));

export const validateWord = ({ kanji, reading, meaningsTh, meaningsEn }: WordDraft): WordFieldErrors => {
    const errors: WordFieldErrors = {};

    if (!kanji) errors.kanji = 'errKanjiRequired';
    else if (kanji.length > KanjiMaxLength || !JapaneseRegex.test(kanji)) errors.kanji = 'errKanjiInvalid';

    if (!reading) errors.reading = 'errReadingRequired';
    else if (reading.length > ReadingMaxLength || !KanaRegex.test(reading)) errors.reading = 'errReadingInvalid';

    if (meaningsTh.length > MeaningMaxItems || meaningsEn.length > MeaningMaxItems) {
        errors.meaningsTh = 'errMeaningInvalid';
    } else if (!meaningsValid(meaningsTh, ThaiRegex, HasThai)) {
        errors.meaningsTh = 'errMeaningThInvalid';
    }

    if (!meaningsValid(meaningsEn, EnglishRegex, HasEnglish)) errors.meaningsEn = 'errMeaningEnInvalid';

    if (meaningsTh.length === 0 && meaningsEn.length === 0) errors.meaningsTh = 'errMeaningRequired';

    return errors;
};
