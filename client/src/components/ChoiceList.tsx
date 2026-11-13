import type { JSX } from 'react';
import type { ChoiceListProps } from '@/types';

export const ChoiceList = ({ choices, japanese, selected, correctAnswer, disabled, onChoose }: ChoiceListProps): JSX.Element => {
    const answered: boolean = correctAnswer !== undefined;

    const stateOf = (choice: string): string => {
        if (!answered) return '';
        if (choice === correctAnswer) return ' correct';
        if (choice === selected) return ' wrong';
        return '';
    };

    return (
        <div className="choices">
            {choices.map(
                (choice: string, i: number): JSX.Element => (
                    <button
                        key={choice}
                        type="button"
                        className={`choice${japanese ? ' jp' : ''}${stateOf(choice)}`}
                        lang={japanese ? 'ja' : undefined}
                        disabled={disabled || answered}
                        onClick={(): void => onChoose(choice)}
                    >
                        <span className="k" aria-hidden="true">
                            {i + 1}
                        </span>
                        {choice}
                    </button>
                ),
            )}
        </div>
    );
};
