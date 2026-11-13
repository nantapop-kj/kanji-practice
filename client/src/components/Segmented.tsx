import type { JSX } from 'react';
import type { SegmentedOption, SegmentedProps } from '@/types';

export const Segmented = <T extends string>({ value, options, label, onChange }: SegmentedProps<T>): JSX.Element => (
    <div className="seg" role="group" aria-label={label}>
        {options.map(
            (option: SegmentedOption<T>): JSX.Element => (
                <button
                    key={option.value}
                    type="button"
                    aria-pressed={option.value === value}
                    disabled={option.disabled}
                    onClick={(): void => onChange(option.value)}
                >
                    {option.label}
                </button>
            ),
        )}
    </div>
);
