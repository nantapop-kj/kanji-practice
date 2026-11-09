import { useCallback, useEffect, useState } from 'react';
import { wordsApi } from '@/services/word.service';
import type { WordListQuery, WordListResponse } from '@/types/word';

export const useWords = ({ page, pageSize, search, level }: WordListQuery) => {
    const [data, setData] = useState<WordListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        wordsApi
            .list({ page, pageSize, search, level })
            .then((r) => active && setData(r))
            .catch((err: unknown) => active && setError(err))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [page, pageSize, search, level, version]);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    return { data, loading, error, reload };
};
