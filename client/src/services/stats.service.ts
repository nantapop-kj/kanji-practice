import type { StatsApi, StatsResponse } from '@/types';
import { http } from './http';

export const statsApi: StatsApi = {
    get: (): Promise<StatsResponse> => http.get<StatsResponse>('/stats'),
    reset: (): Promise<void> => http.delete<void>('/stats'),
};
