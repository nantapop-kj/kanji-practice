export const QuestionTypeFilter = {
    Mix: 'mix',
    Read: 'read',
    Mean: 'mean',
} as const;

export type QuestionTypeFilter = (typeof QuestionTypeFilter)[keyof typeof QuestionTypeFilter];

export const QuestionTypeFilters: QuestionTypeFilter[] = Object.values(QuestionTypeFilter);
