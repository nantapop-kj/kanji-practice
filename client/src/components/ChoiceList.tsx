interface ChoiceListProps {
    choices: string[];
    japanese: boolean;
    selected: string;
    correctAnswer?: string;
    disabled: boolean;
    onChoose: (choice: string) => void;
}

export const ChoiceList = ({ choices, japanese, selected, correctAnswer, disabled, onChoose }: ChoiceListProps) => {
    const answered = correctAnswer !== undefined;

    const stateOf = (choice: string): string => {
        if (!answered) return '';
        if (choice === correctAnswer) return ' correct';
        if (choice === selected) return ' wrong';
        return '';
    };

    return (
        <div className="choices">
            {choices.map((choice, i) => (
                <button
                    key={choice}
                    type="button"
                    className={`choice${japanese ? ' jp' : ''}${stateOf(choice)}`}
                    lang={japanese ? 'ja' : undefined}
                    disabled={disabled || answered}
                    onClick={() => onChoose(choice)}
                >
                    <span className="k" aria-hidden="true">
                        {i + 1}
                    </span>
                    {choice}
                </button>
            ))}
        </div>
    );
};
