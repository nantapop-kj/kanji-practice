import type { ClientLogLevel } from '@/enums';

export interface ClientErrorReport {
    level: ClientLogLevel;
    message: string;
    source: string;
    stack?: string;
}

export interface ClientLogBody extends ClientErrorReport {
    url: string;
}
