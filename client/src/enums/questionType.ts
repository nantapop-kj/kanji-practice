export const QuestionType = {
    Read: 'read',
    Mean: 'mean',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
