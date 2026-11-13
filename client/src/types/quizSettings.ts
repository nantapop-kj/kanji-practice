import type { QuizPrefs } from './quiz';
import type { LevelCounts } from './word';

export interface QuizSettingsProps {
    prefs: QuizPrefs;
    counts: LevelCounts | null;
    onChange: (next: Partial<QuizPrefs>) => void;
}
