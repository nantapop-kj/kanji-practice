export const AnswerMode = {
    Choice: 'choice',
    Typing: 'typing',
} as const;

export type AnswerMode = (typeof AnswerMode)[keyof typeof AnswerMode];

export const AnswerModes: AnswerMode[] = Object.values(AnswerMode);
