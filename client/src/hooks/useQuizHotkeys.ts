import { useEffect } from 'react';

interface QuizHotkeys {
    choiceCount: number;
    answered: boolean;
    disabled: boolean;
    onChoose: (index: number) => void;
    onNext: () => void;
}

const isTypingTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export const useQuizHotkeys = ({ choiceCount, answered, disabled, onChoose, onNext }: QuizHotkeys) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (disabled || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;

            if (answered && e.key === 'Enter') {
                if (e.target instanceof HTMLButtonElement) return;
                e.preventDefault();
                onNext();
                return;
            }

            if (answered || isTypingTarget(e.target)) return;
            const index = Number(e.key) - 1;
            if (Number.isInteger(index) && index >= 0 && index < choiceCount) {
                e.preventDefault();
                onChoose(index);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [choiceCount, answered, disabled, onChoose, onNext]);
};
