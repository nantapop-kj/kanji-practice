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

export type PageItem = number | 'gap';

export interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    pageSizes: readonly number[];
    disabled?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}
