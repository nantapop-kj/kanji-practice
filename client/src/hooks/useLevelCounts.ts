import { useEffect, useState } from 'react';
import { quizApi } from '@/services';
import type { LevelCounts } from '@/types';

export const useLevelCounts = (): LevelCounts | null => {
    const [counts, setCounts] = useState<LevelCounts | null>(null);

    useEffect((): (() => void) => {
        let active: boolean = true;

        quizApi
            .levels()
            .then((r): void => {
                if (active) setCounts(r.levels);
            })
            .catch((): void => {
                if (active) setCounts(null);
            });

        return (): void => {
            active = false;
        };
    }, []);

    return counts;
};
