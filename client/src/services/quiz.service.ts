import { http } from '@/services/http';
import type { AnswerResult, NextQuestionParams, Question, QuestionType, Stat } from '@/types/quiz';
import type { LevelCounts } from '@/types/word';

const toQueryString = ({ levels, type, mode, focus, lang, exclude }: NextQuestionParams): string => {
    const params = new URLSearchParams({ type, mode, lang, focus: focus ? '1' : '0' });
    if (levels.length) params.set('levels', levels.join(','));
    if (exclude.length) params.set('exclude', exclude.join(','));
    return params.toString();
};

export const quizApi = {
    next: (params: NextQuestionParams) => http.get<Question>(`/quiz/next?${toQueryString(params)}`),
    answer: (input: { wordId: number; qtype: QuestionType; mode: Question['mode']; lang: Question['lang']; answer: string }) =>
        http.post<AnswerResult>('/quiz/answer', input),
    override: (input: { wordId: number; qtype: QuestionType }) => http.post<{ stat: Stat }>('/quiz/override', input),
    levels: () => http.get<{ levels: LevelCounts }>('/words/levels'),
};
