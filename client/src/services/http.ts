import { HttpMethod, HttpStatus } from '@/enums';
import type { ErrorBody, HttpClient } from '@/types';

export class ApiError extends Error {
    readonly status: number;
    readonly code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

const ApiBase = '/api/v1';

const request = async <T>(method: HttpMethod, path: string, body?: unknown): Promise<T> => {
    const res: Response = await fetch(ApiBase + path, {
        method,
        credentials: 'include',
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === HttpStatus.NoContent) return undefined as T;

    const data: unknown = await res.json().catch((): object => ({}));

    if (!res.ok) {
        const { error } = data as ErrorBody;
        throw new ApiError(error?.message ?? `HTTP ${res.status}`, res.status, error?.code);
    }

    return data as T;
};

export const http: HttpClient = {
    get: <T>(path: string): Promise<T> => request<T>(HttpMethod.Get, path),
    post: <T>(path: string, body?: unknown): Promise<T> => request<T>(HttpMethod.Post, path, body),
    put: <T>(path: string, body?: unknown): Promise<T> => request<T>(HttpMethod.Put, path, body),
    delete: <T>(path: string): Promise<T> => request<T>(HttpMethod.Delete, path),
};
