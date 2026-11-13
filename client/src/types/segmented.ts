export interface SegmentedOption<T extends string> {
    value: T;
    label: string;
    disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
    value: T;
    options: SegmentedOption<T>[];
    label: string;
    onChange: (value: T) => void;
}
