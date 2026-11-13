import type { AnswerResult } from './quiz';

export interface AnswerFeedbackProps {
    result: AnswerResult;
    given: string;
    overridden: boolean;
    busy: boolean;
    onOverride: () => void;
    onNext: () => void;
}
