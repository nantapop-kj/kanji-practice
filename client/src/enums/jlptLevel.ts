export const JlptLevel = {
    N5: 'N5',
    N4: 'N4',
    N3: 'N3',
    N2: 'N2',
    N1: 'N1',
} as const;

export type JlptLevel = (typeof JlptLevel)[keyof typeof JlptLevel];

export const JlptLevels: JlptLevel[] = Object.values(JlptLevel);

export const DefaultLevel: JlptLevel = JlptLevel.N5;
