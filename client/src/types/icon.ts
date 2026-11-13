import type { SVGProps } from 'react';
import type { IconName } from '@/enums';

export interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}
