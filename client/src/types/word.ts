import type { JlptLevel } from '@/lib/levels';
import type { Paginated } from '@/types/user';

export interface Word {
    id: number;
    kanji: string;
    reading: string;
    meaningsTh: string[];
    meaningsEn: string[];
    level: JlptLevel;
}

export type WordInput = Omit<Word, 'id'>;

export interface WordListQuery {
    page: number;
    pageSize: number;
    search: string;
    level: JlptLevel | '';
}

export type LevelCounts = Record<JlptLevel, number>;

export interface WordListResponse extends Paginated<Word> {
    levelCounts: LevelCounts;
}
