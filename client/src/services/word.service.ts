import { http } from '@/services/http';
import type { Word, WordInput, WordListQuery, WordListResponse } from '@/types/word';

const toQueryString = ({ page, pageSize, search, level }: WordListQuery): string => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) params.set('search', search);
    if (level) params.set('level', level);
    return params.toString();
};

export const wordsApi = {
    list: (query: WordListQuery) => http.get<WordListResponse>(`/words?${toQueryString(query)}`),
    create: (input: WordInput) => http.post<{ word: Word }>('/words', input),
    update: (id: number, input: WordInput) => http.put<{ word: Word }>(`/words/${id}`, input),
    remove: (id: number) => http.delete<void>(`/words/${id}`),
};
