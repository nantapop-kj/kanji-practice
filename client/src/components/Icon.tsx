import type { JSX } from 'react';
import { IconName } from '@/enums';
import type { IconProps } from '@/types';

const IconPaths: Record<IconName, string[]> = {
    [IconName.Edit]: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
    [IconName.Trash]: [
        'M3 6h18',
        'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
        'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
        'M10 11v6',
        'M14 11v6',
    ],
};

export const Icon = ({ name, size = 16, ...props }: IconProps): JSX.Element => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {IconPaths[name].map((d: string): JSX.Element => (
            <path key={d} d={d} />
        ))}
    </svg>
);
