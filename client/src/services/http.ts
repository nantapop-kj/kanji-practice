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

type ErrorBody = { error?: { code?: string; message?: string } };

const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
    const res = await fetch(ApiBase + path, {
        method,
        credentials: 'include',
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return undefined as T;

    const data: unknown = await res.json().catch(() => ({}));

    if (!res.ok) {
        const { error } = data as ErrorBody;
        throw new ApiError(error?.message ?? `HTTP ${res.status}`, res.status, error?.code);
    }

    return data as T;
};

export const http = {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
    put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
    delete: <T>(path: string) => request<T>('DELETE', path),
};
