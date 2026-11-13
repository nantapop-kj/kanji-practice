export const ClientLogLevel = {
    Error: 'error',
    Warn: 'warn',
} as const;

export type ClientLogLevel = (typeof ClientLogLevel)[keyof typeof ClientLogLevel];
