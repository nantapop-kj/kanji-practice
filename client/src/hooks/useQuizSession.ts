import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { Language } from '@/enums';
import { quizApi } from '@/services';
import type { AnswerResult, Question, QuizPrefs, SessionScore, UseQuizSessionResult } from '@/types';

const RecentLimit = 5;
const EmptyScore: SessionScore = { answered: 0, correct: 0, streak: 0, bestStreak: 0 };

export const useQuizSession = (prefs: QuizPrefs, lang: Language): UseQuizSessionResult => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [result, setResult] = useState<AnswerResult | null>(null);
    const [given, setGiven] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [overridden, setOverridden] = useState<boolean>(false);
    const [error, setError] = useState<unknown>(null);
    const [score, setScore] = useState<SessionScore>(EmptyScore);
    const recent: RefObject<number[]> = useRef<number[]>([]);
    const requestId: RefObject<number> = useRef<number>(0);

    const loadNext = useCallback(async (): Promise<void> => {
        const id: number = ++requestId.current;
        setLoading(true);
        setError(null);
        setResult(null);
        setGiven('');
        setOverridden(false);

        try {
            const next: Question = await quizApi.next({ ...prefs, lang, exclude: recent.current });
            if (id !== requestId.current) return;
            recent.current = [...recent.current, next.wordId].slice(-RecentLimit);
            setQuestion(next);
        } catch (err) {
            if (id !== requestId.current) return;
            setQuestion(null);
            setError(err);
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, [prefs, lang]);

    useEffect((): void => {
        void loadNext();
    }, [loadNext]);

    const submit = useCallback(
        async (answer: string): Promise<void> => {
            if (!question || result || submitting) return;

            setSubmitting(true);
            setGiven(answer);
            setError(null);
            try {
                const res: AnswerResult = await quizApi.answer({
                    wordId: question.wordId,
                    qtype: question.qtype,
                    mode: question.mode,
                    lang: question.lang,
                    answer,
                });
                setResult(res);
                setScore((s: SessionScore): SessionScore => {
                    const streak: number = res.correct ? s.streak + 1 : 0;
                    return {
                        answered: s.answered + 1,
                        correct: s.correct + (res.correct ? 1 : 0),
                        streak,
                        bestStreak: Math.max(s.bestStreak, streak),
                    };
                });
            } catch (err) {
                setGiven('');
                setError(err);
            } finally {
                setSubmitting(false);
            }
        },
        [question, result, submitting],
    );

    const override = useCallback(async (): Promise<void> => {
        if (!question || !result?.canOverride || overridden) return;

        setSubmitting(true);
        try {
            const { stat } = await quizApi.override({ wordId: question.wordId, qtype: question.qtype });
            setOverridden(true);
            setResult({ ...result, correct: true, canOverride: false, stat });
            setScore((s: SessionScore): SessionScore => {
                const streak: number = s.streak + 1;
                return { ...s, correct: s.correct + 1, streak, bestStreak: Math.max(s.bestStreak, streak) };
            });
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    }, [question, result, overridden]);

    const resetScore = useCallback((): void => setScore(EmptyScore), []);

    return { question, result, given, loading, submitting, overridden, error, score, loadNext, submit, override, resetScore };
};
