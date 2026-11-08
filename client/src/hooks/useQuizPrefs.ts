import { useCallback, useState } from 'react';
import { JlptLevels, type JlptLevel } from '@/lib/levels';
import { storage, StorageKeys } from '@/lib/storage';
import type { AnswerMode, QuestionTypeFilter, QuizPrefs } from '@/types/quiz';

const DefaultPrefs: QuizPrefs = { levels: ['N5'], type: 'mix', mode: 'choice', focus: true };

const Types: QuestionTypeFilter[] = ['mix', 'read', 'mean'];
const Modes: AnswerMode[] = ['choice', 'typing'];

const sanitize = (raw: Partial<QuizPrefs>): QuizPrefs => {
    const levels = Array.isArray(raw.levels)
        ? JlptLevels.filter((l) => (raw.levels as string[]).includes(l))
        : DefaultPrefs.levels;

    return {
        levels: levels.length ? (levels as JlptLevel[]) : DefaultPrefs.levels,
        type: Types.includes(raw.type as QuestionTypeFilter) ? (raw.type as QuestionTypeFilter) : DefaultPrefs.type,
        mode: Modes.includes(raw.mode as AnswerMode) ? (raw.mode as AnswerMode) : DefaultPrefs.mode,
        focus: typeof raw.focus === 'boolean' ? raw.focus : DefaultPrefs.focus,
    };
};

export const useQuizPrefs = () => {
    const [prefs, setPrefs] = useState<QuizPrefs>(() => sanitize(storage.getJSON(StorageKeys.quizPrefs, DefaultPrefs)));

    const updatePrefs = useCallback((next: Partial<QuizPrefs>) => {
        setPrefs((current) => {
            const merged = sanitize({ ...current, ...next });
            storage.setJSON(StorageKeys.quizPrefs, merged);
            return merged;
        });
    }, []);

    return { prefs, updatePrefs };
};
