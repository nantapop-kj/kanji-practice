export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
    }
  },

  getJSON<T>(key: string, fallback: T): T {
    try {
      const v = this.get(key);
      return v ? { ...fallback, ...JSON.parse(v) } : fallback;
    } catch {
      return fallback;
    }
  },

  setJSON(key: string, value: unknown): void {
    this.set(key, JSON.stringify(value));
  },
};

export const StorageKeys = {
  language: 'kanjiPracticeLang',
  theme: 'kanjiPracticeTheme',
  quizPrefs: 'kanjiPracticeQuizPrefs',
} as const;
