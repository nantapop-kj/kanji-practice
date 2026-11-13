export const Language = {
    Th: 'th',
    En: 'en',
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const Languages: Language[] = Object.values(Language);
