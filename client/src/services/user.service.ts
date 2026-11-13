import type { Paginated, PaginationQuery, PublicUser, UsersApi } from '@/types';
import { http } from './http';

export const usersApi: UsersApi = {
    list: ({ page, pageSize }: PaginationQuery): Promise<Paginated<PublicUser>> =>
        http.get<Paginated<PublicUser>>(`/users?${new URLSearchParams({ page: String(page), pageSize: String(pageSize) })}`),
};
