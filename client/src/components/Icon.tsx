import type { SVGProps } from 'react';

export type IconName = 'edit' | 'trash';

const Paths: Record<IconName, string[]> = {
    edit: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
    trash: ['M3 6h18', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6', 'M10 11v6', 'M14 11v6'],
};

export const Icon = ({ name, size = 16, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) => (
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
        {Paths[name].map((d) => (
            <path key={d} d={d} />
        ))}
    </svg>
);
