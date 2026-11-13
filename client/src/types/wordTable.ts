import type { LevelCounts, LevelFilter, Word } from './word';

export interface WordTableProps {
    words: Word[];
    total: number;
    levelCounts?: LevelCounts;
    search: string;
    level: LevelFilter;
    loading: boolean;
    selectedId?: number;
    onSearchChange: (search: string) => void;
    onLevelChange: (level: LevelFilter) => void;
    onEdit: (word: Word) => void;
    onDelete: (word: Word) => void;
}
