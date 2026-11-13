import type { StatsWord } from './stats';

export interface WeakWordsTableProps {
    words: StatsWord[];
}

export interface ScoreProps {
    correct: number;
    wrong: number;
}
