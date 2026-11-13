import { useCallback, useState } from 'react';
import {
    AnswerMode,
    AnswerModes,
    JlptLevel,
    JlptLevels,
    QuestionTypeFilter,
    QuestionTypeFilters,
    StorageKey,
} from '@/enums';
import { storage } from '@/lib';
import type { QuizPrefs, UseQuizPrefsResult } from '@/types';

const DefaultPrefs: QuizPrefs = {
    levels: [JlptLevel.N5],
    type: QuestionTypeFilter.Mix,
    mode: AnswerMode.Choice,
    focus: true,
};

const sanitize = (raw: Partial<QuizPrefs>): QuizPrefs => {
    const levels: JlptLevel[] = Array.isArray(raw.levels)
        ? JlptLevels.filter((l: JlptLevel): boolean => (raw.levels as string[]).includes(l))
        : DefaultPrefs.levels;

    return {
        levels: levels.length ? levels : DefaultPrefs.levels,
        type: QuestionTypeFilters.includes(raw.type as QuestionTypeFilter) ? (raw.type as QuestionTypeFilter) : DefaultPrefs.type,
        mode: AnswerModes.includes(raw.mode as AnswerMode) ? (raw.mode as AnswerMode) : DefaultPrefs.mode,
        focus: typeof raw.focus === 'boolean' ? raw.focus : DefaultPrefs.focus,
    };
};

export const useQuizPrefs = (): UseQuizPrefsResult => {
    const [prefs, setPrefs] = useState<QuizPrefs>((): QuizPrefs => sanitize(storage.getJSON(StorageKey.QuizPrefs, DefaultPrefs)));

    const updatePrefs = useCallback((next: Partial<QuizPrefs>): void => {
        setPrefs((current: QuizPrefs): QuizPrefs => {
            const merged: QuizPrefs = sanitize({ ...current, ...next });
            storage.setJSON(StorageKey.QuizPrefs, merged);
            return merged;
        });
    }, []);

    return { prefs, updatePrefs };
};
