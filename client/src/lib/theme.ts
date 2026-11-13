import { DefaultTheme, StorageKey, Theme, Themes } from '@/enums';
import { storage } from './storage';

export const getStoredTheme = (): Theme => {
    const theme: string | null = storage.get(StorageKey.Theme);

    return Themes.includes(theme as Theme) ? (theme as Theme) : DefaultTheme;
};

export const applyTheme = (theme: Theme): void => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.set(StorageKey.Theme, theme);
};
