import type { QuizPrefs } from './quiz';

export interface UseQuizPrefsResult {
    prefs: QuizPrefs;
    updatePrefs: (next: Partial<QuizPrefs>) => void;
}
