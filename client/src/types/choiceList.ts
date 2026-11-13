export interface ChoiceListProps {
    choices: string[];
    japanese: boolean;
    selected: string;
    correctAnswer?: string;
    disabled: boolean;
    onChoose: (choice: string) => void;
}
