import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '@/services/user.service';
import type { Paginated, PaginationQuery, PublicUser } from '@/types/user';

export const useUsers = ({ page, pageSize }: PaginationQuery) => {
    const [data, setData] = useState<Paginated<PublicUser> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        usersApi
            .list({ page, pageSize })
            .then((r) => active && setData(r))
            .catch((err: unknown) => active && setError(err))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [page, pageSize, version]);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    return { data, loading, error, reload };
};
