export const WordFilter = {
    Weak: 'weak',
    All: 'all',
} as const;

export type WordFilter = (typeof WordFilter)[keyof typeof WordFilter];
