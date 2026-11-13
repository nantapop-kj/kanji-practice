import type { AnswerMode, JlptLevel, Language, QuestionType, QuestionTypeFilter } from '@/enums';
import type { LevelCountsResponse, Word } from './word';

export interface QuizPrefs {
    levels: JlptLevel[];
    type: QuestionTypeFilter;
    mode: AnswerMode;
    focus: boolean;
}

export interface NextQuestionParams extends QuizPrefs {
    lang: Language;
    exclude: number[];
}

export interface Question {
    wordId: number;
    kanji: string;
    level: JlptLevel;
    qtype: QuestionType;
    mode: AnswerMode;
    lang: Language;
    choices?: string[];
    wrongCount: number;
}

export interface Stat {
    correctCount: number;
    wrongCount: number;
    lastCorrect: boolean | null;
}

export interface AnswerResult {
    correct: boolean;
    correctAnswer: string;
    word: Word;
    stat: Stat;
    canOverride: boolean;
}

export interface SessionScore {
    answered: number;
    correct: number;
    streak: number;
    bestStreak: number;
}

export interface AnswerInput {
    wordId: number;
    qtype: QuestionType;
    mode: AnswerMode;
    lang: Language;
    answer: string;
}

export interface OverrideInput {
    wordId: number;
    qtype: QuestionType;
}

export interface OverrideResponse {
    stat: Stat;
}

export interface QuizApi {
    next: (params: NextQuestionParams) => Promise<Question>;
    answer: (input: AnswerInput) => Promise<AnswerResult>;
    override: (input: OverrideInput) => Promise<OverrideResponse>;
    levels: () => Promise<LevelCountsResponse>;
}
