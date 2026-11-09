export const JlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

export type JlptLevel = (typeof JlptLevels)[number];

export const DefaultLevel: JlptLevel = 'N5';
