import { storage, StorageKeys } from '@/lib/storage';

export type ThemePref = 'light' | 'dark';

export const DefaulLtTheme: ThemePref = 'light';

export const getStoredTheme = (): ThemePref => {
    const theme = storage.get(StorageKeys.theme);
    return theme === 'light' || theme === 'dark' ? theme : DefaulLtTheme;
}

export const applyTheme = (t: ThemePref): void => {
    document.documentElement.setAttribute('data-theme', t);
    storage.set(StorageKeys.theme, t);
}
