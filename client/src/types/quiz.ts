import type { Language } from '@/i18n';
import type { JlptLevel } from '@/lib/levels';
import type { LevelCounts, Word } from '@/types/word';

export type QuestionType = 'read' | 'mean';
export type QuestionTypeFilter = 'mix' | QuestionType;
export type AnswerMode = 'choice' | 'typing';

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

export type { LevelCounts };
