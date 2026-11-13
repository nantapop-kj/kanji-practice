import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delayMs: number): T => {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect((): (() => void) => {
        const timer: ReturnType<typeof setTimeout> = setTimeout((): void => setDebounced(value), delayMs);
        return (): void => clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
};
