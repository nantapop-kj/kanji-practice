import type { Location } from 'react-router-dom';
import type { TKey } from './i18nContext';

export type LoginField = 'email' | 'name' | 'password' | 'confirmPassword';

export type LoginFieldErrors = Partial<Record<LoginField, TKey>>;

export interface LoginLocationState {
    from?: Location;
}
