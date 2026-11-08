import { http } from '@/services/http';
import type { Paginated, PaginationQuery, PublicUser } from '@/types/user';

export const usersApi = {
    list: ({ page, pageSize }: PaginationQuery) =>
        http.get<Paginated<PublicUser>>(`/users?${new URLSearchParams({ page: String(page), pageSize: String(pageSize) })}`),
};
