import { useCallback, useEffect, useState } from 'react';
import { wordsApi } from '@/services';
import type { AsyncResource, WordListQuery, WordListResponse } from '@/types';

export const useWords = ({ page, pageSize, search, level }: WordListQuery): AsyncResource<WordListResponse> => {
    const [data, setData] = useState<WordListResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);
    const [version, setVersion] = useState<number>(0);

    useEffect((): (() => void) => {
        let active: boolean = true;
        setLoading(true);
        setError(null);

        wordsApi
            .list({ page, pageSize, search, level })
            .then((r: WordListResponse): void => {
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
    }, [page, pageSize, search, level, version]);

    const reload = useCallback((): void => setVersion((v: number): number => v + 1), []);

    return { data, loading, error, reload };
};
