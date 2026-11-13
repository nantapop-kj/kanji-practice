import { useCallback, useEffect, useState } from 'react';
import { statsApi } from '@/services';
import type { AsyncResource, StatsResponse } from '@/types';

export const useStats = (): AsyncResource<StatsResponse> => {
    const [data, setData] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);
    const [version, setVersion] = useState<number>(0);

    useEffect((): (() => void) => {
        let active: boolean = true;
        setLoading(true);
        setError(null);

        statsApi
            .get()
            .then((r: StatsResponse): void => {
                if (active) setData(r);
            })
            .catch((err: unknown): void => {
                if (active) setError(err);
            })
            .finally((): void => {
                if (active) setLoading(false);
            });

        return (): void => {
            active = false;
        };
    }, [version]);

    const reload = useCallback((): void => setVersion((v: number): number => v + 1), []);

    return { data, loading, error, reload };
};
