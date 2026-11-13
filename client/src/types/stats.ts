import type { JlptLevel } from '@/enums';

export interface StatsWord {
    wordId: number;
    kanji: string;
    reading: string;
    meaningsTh: string[];
    meaningsEn: string[];
    level: JlptLevel;
    readCorrect: number;
    readWrong: number;
    meanCorrect: number;
    meanWrong: number;
    lastWrong: boolean;
    weak: boolean;
    lastAnsweredAt: string | null;
}

export interface LevelStat {
    level: JlptLevel;
    answered: number;
    correct: number;
    practicedWords: number;
    totalWords: number;
}

export interface StatsSummary {
    answered: number;
    correct: number;
    wrong: number;
    accuracy: number | null;
    practicedWords: number;
    totalWords: number;
    weakWords: number;
}

export interface StatsResponse {
    summary: StatsSummary;
    levels: LevelStat[];
    words: StatsWord[];
}

export interface StatsApi {
    get: () => Promise<StatsResponse>;
    reset: () => Promise<void>;
}
