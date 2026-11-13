import type { TKey } from './i18nContext';

export interface TabItem {
    to: string;
    label: TKey;
    adminOnly?: boolean;
}
