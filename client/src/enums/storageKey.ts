export const StorageKey = {
    Language: 'kanjiPracticeLang',
    Theme: 'kanjiPracticeTheme',
    QuizPrefs: 'kanjiPracticeQuizPrefs',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
