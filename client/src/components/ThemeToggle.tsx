import { useEffect, useState, type JSX } from 'react';
import { useI18n } from '@/contexts';
import { Theme, Themes } from '@/enums';
import { applyTheme, getStoredTheme } from '@/lib';
import type { TKey } from '@/types';
import './ThemeToggle.css';

const ThemeIcons: Record<Theme, JSX.Element> = {
    [Theme.Light]: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
    ),
    [Theme.Dark]: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
    ),
};

const ThemeLabels: Record<Theme, TKey> = {
    [Theme.Light]: 'themeLight',
    [Theme.Dark]: 'themeDark',
};

export const ThemeToggle = (): JSX.Element => {
    const { t } = useI18n();
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    useEffect((): void => applyTheme(theme), [theme]);

    return (
        <div className="pill-toggle" role="group" aria-label="Theme">
            {Themes.map(
                (option: Theme): JSX.Element => (
                    <button
                        key={option}
                        className="pill-icon"
                        aria-pressed={theme === option}
                        title={t(ThemeLabels[option])}
                        aria-label={t(ThemeLabels[option])}
                        onClick={(): void => setTheme(option)}
                    >
                        {ThemeIcons[option]}
                    </button>
                ),
            )}
        </div>
    );
};
