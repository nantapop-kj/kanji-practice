export interface ErrorBody {
    error?: {
        code?: string;
        message?: string;
    };
}

export interface HttpClient {
    get: <T>(path: string) => Promise<T>;
    post: <T>(path: string, body?: unknown) => Promise<T>;
    put: <T>(path: string, body?: unknown) => Promise<T>;
    delete: <T>(path: string) => Promise<T>;
}
