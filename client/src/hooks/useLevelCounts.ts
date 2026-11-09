import { useEffect, useState } from 'react';
import { quizApi } from '@/services/quiz.service';
import type { LevelCounts } from '@/types/word';

export const useLevelCounts = () => {
    const [counts, setCounts] = useState<LevelCounts | null>(null);

    useEffect(() => {
        let active = true;
        quizApi
            .levels()
            .then((r) => active && setCounts(r.levels))
            .catch(() => active && setCounts(null));
        return () => {
            active = false;
        };
    }, []);

    return counts;
};
