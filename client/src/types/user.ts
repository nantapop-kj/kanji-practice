import type { Role } from '@/enums';
import type { Paginated, PaginationQuery } from './pagination';

export interface PublicUser {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
    updatedBy: string | null;
}

export interface UsersApi {
    list: (query: PaginationQuery) => Promise<Paginated<PublicUser>>;
}
