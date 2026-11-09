import { useCallback, useEffect, useState } from 'react';
import { statsApi } from '@/services/stats.service';
import type { StatsResponse } from '@/types/stats';

export const useStats = () => {
    const [data, setData] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        statsApi
            .get()
            .then((r) => active && setData(r))
            .catch((err: unknown) => active && setError(err))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [version]);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    return { data, loading, error, reload };
};
