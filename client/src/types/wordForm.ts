import type { JlptLevel } from '@/enums';
import type { Word } from './word';

export interface WordFormProps {
    editing: Word | null;
    onSaved: () => void;
    onCancel: () => void;
}

export interface WordFormState {
    kanji: string;
    reading: string;
    meaningsTh: string;
    meaningsEn: string;
    level: JlptLevel;
}

export interface FormMessage {
    ok: boolean;
    text: string;
}
