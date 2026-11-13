export interface AsyncResource<T> {
    data: T | null;
    loading: boolean;
    error: unknown;
    reload: () => void;
}
