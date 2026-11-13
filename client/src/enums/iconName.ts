export const IconName = {
    Edit: 'edit',
    Trash: 'trash',
} as const;

export type IconName = (typeof IconName)[keyof typeof IconName];
