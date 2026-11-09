import type { Role } from '@/types/auth';

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

export interface PaginationQuery {
    page: number;
    pageSize: number;
}

export interface Paginated<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
