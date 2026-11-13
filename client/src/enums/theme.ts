export const Theme = {
    Light: 'light',
    Dark: 'dark',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const Themes: Theme[] = Object.values(Theme);

export const DefaultTheme: Theme = Theme.Light;
