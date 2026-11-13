import type { AnswerResult, Question, SessionScore } from './quiz';

export interface UseQuizSessionResult {
    question: Question | null;
    result: AnswerResult | null;
    given: string;
    loading: boolean;
    submitting: boolean;
    overridden: boolean;
    error: unknown;
    score: SessionScore;
    loadNext: () => Promise<void>;
    submit: (answer: string) => Promise<void>;
    override: () => Promise<void>;
    resetScore: () => void;
}
