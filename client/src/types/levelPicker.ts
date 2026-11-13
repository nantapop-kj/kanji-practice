import type { JlptLevel } from '@/enums';
import type { LevelCounts } from './word';

export interface LevelPickerProps {
    value: JlptLevel[];
    counts: LevelCounts | null;
    onChange: (levels: JlptLevel[]) => void;
}
