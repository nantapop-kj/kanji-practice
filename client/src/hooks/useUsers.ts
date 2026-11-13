import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '@/services';
import type { AsyncResource, Paginated, PaginationQuery, PublicUser } from '@/types';

export const useUsers = ({ page, pageSize }: PaginationQuery): AsyncResource<Paginated<PublicUser>> => {
    const [data, setData] = useState<Paginated<PublicUser> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);
    const [version, setVersion] = useState<number>(0);

    useEffect((): (() => void) => {
        let active: boolean = true;
        setLoading(true);
        setError(null);

        usersApi
            .list({ page, pageSize })
            .then((r: Paginated<PublicUser>): void => {
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
    }, [page, pageSize, version]);

    const reload = useCallback((): void => setVersion((v: number): number => v + 1), []);

    return { data, loading, error, reload };
};
