interface SegmentedProps<T extends string> {
    value: T;
    options: { value: T; label: string; disabled?: boolean }[];
    label: string;
    onChange: (value: T) => void;
}

export const Segmented = <T extends string>({ value, options, label, onChange }: SegmentedProps<T>) => (
    <div className="seg" role="group" aria-label={label}>
        {options.map((option) => (
            <button
                key={option.value}
                type="button"
                aria-pressed={option.value === value}
                disabled={option.disabled}
                onClick={() => onChange(option.value)}
            >
                {option.label}
            </button>
        ))}
    </div>
);
