import type { StorageKey } from '@/enums';
import type { StorageApi } from '@/types';

export const storage: StorageApi = {
    get(key: StorageKey): string | null {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },

    set(key: StorageKey, value: string): void {
        try {
            localStorage.setItem(key, value);
        } catch {
            // storage may be unavailable (private mode, blocked site data)
        }
    },

    getJSON<T>(key: StorageKey, fallback: T): T {
        try {
            const v: string | null = storage.get(key);
            return v ? { ...fallback, ...JSON.parse(v) } : fallback;
        } catch {
            return fallback;
        }
    },

    setJSON(key: StorageKey, value: unknown): void {
        storage.set(key, JSON.stringify(value));
    },
};
