import type { JlptLevel } from '@/enums';
import type { Paginated } from './pagination';

export interface Word {
    id: number;
    kanji: string;
    reading: string;
    meaningsTh: string[];
    meaningsEn: string[];
    level: JlptLevel;
}

export type WordInput = Omit<Word, 'id'>;

export type LevelFilter = JlptLevel | '';

export interface WordListQuery {
    page: number;
    pageSize: number;
    search: string;
    level: LevelFilter;
}

export type LevelCounts = Record<JlptLevel, number>;

export interface WordListResponse extends Paginated<Word> {
    levelCounts: LevelCounts;
}

export interface WordResponse {
    word: Word;
}

export interface LevelCountsResponse {
    levels: LevelCounts;
}

export interface WordsApi {
    list: (query: WordListQuery) => Promise<WordListResponse>;
    create: (input: WordInput) => Promise<WordResponse>;
    update: (id: number, input: WordInput) => Promise<WordResponse>;
    remove: (id: number) => Promise<void>;
}
