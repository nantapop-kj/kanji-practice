import type { WordInput, WordListQuery, WordListResponse, WordResponse, WordsApi } from '@/types';
import { http } from './http';

const toQueryString = ({ page, pageSize, search, level }: WordListQuery): string => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) params.set('search', search);
    if (level) params.set('level', level);
    return params.toString();
};

export const wordsApi: WordsApi = {
    list: (query: WordListQuery): Promise<WordListResponse> => http.get<WordListResponse>(`/words?${toQueryString(query)}`),
    create: (input: WordInput): Promise<WordResponse> => http.post<WordResponse>('/words', input),
    update: (id: number, input: WordInput): Promise<WordResponse> => http.put<WordResponse>(`/words/${id}`, input),
    remove: (id: number): Promise<void> => http.delete<void>(`/words/${id}`),
};
