import type { StorageKey } from '@/enums';

export interface StorageApi {
    get: (key: StorageKey) => string | null;
    set: (key: StorageKey, value: string) => void;
    getJSON: <T>(key: StorageKey, fallback: T) => T;
    setJSON: (key: StorageKey, value: unknown) => void;
}
