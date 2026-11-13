import type {
    AnswerInput,
    AnswerResult,
    LevelCountsResponse,
    NextQuestionParams,
    OverrideInput,
    OverrideResponse,
    Question,
    QuizApi,
} from '@/types';
import { http } from './http';

const toQueryString = ({ levels, type, mode, focus, lang, exclude }: NextQuestionParams): string => {
    const params = new URLSearchParams({ type, mode, lang, focus: focus ? '1' : '0' });
    if (levels.length) params.set('levels', levels.join(','));
    if (exclude.length) params.set('exclude', exclude.join(','));
    return params.toString();
};

export const quizApi: QuizApi = {
    next: (params: NextQuestionParams): Promise<Question> => http.get<Question>(`/quiz/next?${toQueryString(params)}`),
    answer: (input: AnswerInput): Promise<AnswerResult> => http.post<AnswerResult>('/quiz/answer', input),
    override: (input: OverrideInput): Promise<OverrideResponse> => http.post<OverrideResponse>('/quiz/override', input),
    levels: (): Promise<LevelCountsResponse> => http.get<LevelCountsResponse>('/words/levels'),
};
