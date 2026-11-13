import type { Language } from '@/enums';

export interface TypingFormProps {
    lang: Language;
    disabled: boolean;
    answered: boolean;
    onSubmit: (answer: string) => void;
}
