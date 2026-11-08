import type { TFn, TKey } from '@/i18n';
import { ApiError } from '@/services/http';

const ErrorCodeKeys: Record<string, TKey> = {
    INVALID_CREDENTIALS: 'invalidCredentials',
    EMAIL_TAKEN: 'emailTaken',
    EMAIL_REQUIRED: 'emailRequired',
    EMAIL_INVALID: 'emailInvalid',
    PASSWORD_REQUIRED: 'passwordRequired',
    PASSWORD_INVALID: 'passwordInvalid',
    NAME_REQUIRED: 'nameRequired',
    NAME_INVALID: 'nameInvalid',
    FORBIDDEN: 'errForbidden',
    WORD_NOT_FOUND: 'errWordNotFound',
    WORD_EXISTS: 'errWordExists',
    KANJI_REQUIRED: 'errKanjiRequired',
    KANJI_INVALID: 'errKanjiInvalid',
    READING_REQUIRED: 'errReadingRequired',
    READING_INVALID: 'errReadingInvalid',
    MEANING_REQUIRED: 'errMeaningRequired',
    MEANING_INVALID: 'errMeaningInvalid',
    MEANING_TH_INVALID: 'errMeaningThInvalid',
    MEANING_EN_INVALID: 'errMeaningEnInvalid',
    LEVEL_INVALID: 'errLevelInvalid',
    NOT_ENOUGH_WORDS: 'errNotEnoughWords',
    NO_MEANING_IN_LANG: 'errNoMeaningInLang',
    OVERRIDE_DENIED: 'errOverrideDenied',
};

const errorCodeMessage = (code: string | undefined, fallback: string, t: TFn): string => {
    const key = code ? ErrorCodeKeys[code] : undefined;

    return key ? t(key) : fallback;
};

export const apiErrorMessage = (err: unknown, t: TFn): string => {
    if (!(err instanceof ApiError)) return t('connectError');

    return errorCodeMessage(err.code, err.message, t);
};
