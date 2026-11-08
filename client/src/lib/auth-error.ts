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
};

export const authErrorMessage = (err: unknown, t: TFn): string => {
    if (!(err instanceof ApiError)) return t('connectError');

    const key = err.code ? ErrorCodeKeys[err.code] : undefined;

    return key ? t(key) : err.message;
};
