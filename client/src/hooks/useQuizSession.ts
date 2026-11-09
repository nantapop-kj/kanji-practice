import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '@/i18n';
import { quizApi } from '@/services/quiz.service';
import type { AnswerResult, Question, QuizPrefs, SessionScore } from '@/types/quiz';

const RecentLimit = 5;
const EmptyScore: SessionScore = { answered: 0, correct: 0, streak: 0, bestStreak: 0 };

export const useQuizSession = (prefs: QuizPrefs, lang: Language) => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [result, setResult] = useState<AnswerResult | null>(null);
    const [given, setGiven] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [overridden, setOverridden] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [score, setScore] = useState<SessionScore>(EmptyScore);
    const recent = useRef<number[]>([]);
    const requestId = useRef(0);

    const loadNext = useCallback(async () => {
        const id = ++requestId.current;
        setLoading(true);
        setError(null);
        setResult(null);
        setGiven('');
        setOverridden(false);

        try {
            const next = await quizApi.next({ ...prefs, lang, exclude: recent.current });
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

    useEffect(() => {
        void loadNext();
    }, [loadNext]);

    const submit = useCallback(
        async (answer: string) => {
            if (!question || result || submitting) return;

            setSubmitting(true);
            setGiven(answer);
            setError(null);
            try {
                const res = await quizApi.answer({
                    wordId: question.wordId,
                    qtype: question.qtype,
                    mode: question.mode,
                    lang: question.lang,
                    answer,
                });
                setResult(res);
                setScore((s) => {
                    const streak = res.correct ? s.streak + 1 : 0;
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

    const override = useCallback(async () => {
        if (!question || !result?.canOverride || overridden) return;

        setSubmitting(true);
        try {
            const { stat } = await quizApi.override({ wordId: question.wordId, qtype: question.qtype });
            setOverridden(true);
            setResult({ ...result, correct: true, canOverride: false, stat });
            setScore((s) => {
                const streak = s.streak + 1;
                return { ...s, correct: s.correct + 1, streak, bestStreak: Math.max(s.bestStreak, streak) };
            });
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    }, [question, result, overridden]);

    const resetScore = useCallback(() => setScore(EmptyScore), []);

    return { question, result, given, loading, submitting, overridden, error, score, loadNext, submit, override, resetScore };
};
