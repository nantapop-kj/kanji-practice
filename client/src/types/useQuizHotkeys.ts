export interface QuizHotkeysOptions {
    choiceCount: number;
    answered: boolean;
    disabled: boolean;
    onChoose: (index: number) => void;
    onNext: () => void;
}
