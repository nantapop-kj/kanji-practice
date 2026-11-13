import { ErrorCode } from '@/enums';
import { ApiError } from '@/services';
import type { TFn, TKey } from '@/types';

const ErrorCodeKeys: Record<ErrorCode, TKey> = {
    [ErrorCode.InvalidCredentials]: 'invalidCredentials',
    [ErrorCode.EmailTaken]: 'emailTaken',
    [ErrorCode.EmailRequired]: 'emailRequired',
    [ErrorCode.EmailInvalid]: 'emailInvalid',
    [ErrorCode.PasswordRequired]: 'passwordRequired',
    [ErrorCode.PasswordInvalid]: 'passwordInvalid',
    [ErrorCode.NameRequired]: 'nameRequired',
    [ErrorCode.NameInvalid]: 'nameInvalid',
    [ErrorCode.Forbidden]: 'errForbidden',
    [ErrorCode.TooManyRequests]: 'errTooManyRequests',
    [ErrorCode.WordNotFound]: 'errWordNotFound',
    [ErrorCode.WordExists]: 'errWordExists',
    [ErrorCode.KanjiRequired]: 'errKanjiRequired',
    [ErrorCode.KanjiInvalid]: 'errKanjiInvalid',
    [ErrorCode.ReadingRequired]: 'errReadingRequired',
    [ErrorCode.ReadingInvalid]: 'errReadingInvalid',
    [ErrorCode.MeaningRequired]: 'errMeaningRequired',
    [ErrorCode.MeaningInvalid]: 'errMeaningInvalid',
    [ErrorCode.MeaningThInvalid]: 'errMeaningThInvalid',
    [ErrorCode.MeaningEnInvalid]: 'errMeaningEnInvalid',
    [ErrorCode.LevelInvalid]: 'errLevelInvalid',
    [ErrorCode.NotEnoughWords]: 'errNotEnoughWords',
    [ErrorCode.NoMeaningInLang]: 'errNoMeaningInLang',
    [ErrorCode.OverrideDenied]: 'errOverrideDenied',
};

const errorCodeMessage = (code: string | undefined, fallback: string, t: TFn): string => {
    const key: TKey | undefined = code ? ErrorCodeKeys[code as ErrorCode] : undefined;

    return key ? t(key) : fallback;
};

export const apiErrorMessage = (err: unknown, t: TFn): string => {
    if (!(err instanceof ApiError)) return t('connectError');

    return errorCodeMessage(err.code, err.message, t);
};
