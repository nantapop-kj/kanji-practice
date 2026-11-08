import { http } from '@/services/http';
import type { StatsResponse } from '@/types/stats';

export const statsApi = {
    get: () => http.get<StatsResponse>('/stats'),
    reset: () => http.delete<void>('/stats'),
};
