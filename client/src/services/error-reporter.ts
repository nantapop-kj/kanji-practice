import { ClientLogLevel } from '@/enums';
import type { ClientErrorReport, ClientLogBody } from '@/types';

const ClientLogUrl = '/api/v1/client-logs';
const MaxReportsPerPage = 10;
const Limits = { message: 2000, stack: 8000, url: 500 } as const;

let sent: number = 0;
const seen: Set<string> = new Set<string>();

export const reportClientError = ({ level, message, source, stack }: ClientErrorReport): void => {
    const key = `${source}|${message}`;
    if (sent >= MaxReportsPerPage || seen.has(key)) return;
    seen.add(key);
    sent++;

    const body: ClientLogBody = {
        level,
        source,
        message: message.slice(0, Limits.message),
        stack: stack?.slice(0, Limits.stack),
        url: location.href.slice(0, Limits.url),
    };

    fetch(ClientLogUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        keepalive: true,
        body: JSON.stringify(body),
    }).catch((): undefined => undefined);
};

const toMessage = (value: unknown): string => (value instanceof Error ? `${value.name}: ${value.message}` : String(value));

export const installGlobalErrorReporting = (): void => {
    window.addEventListener('error', (e: ErrorEvent): void => {
        reportClientError({
            level: ClientLogLevel.Error,
            source: 'window.onerror',
            message: e.error ? toMessage(e.error) : e.message || 'Script error',
            stack: e.error instanceof Error ? e.error.stack : `${e.filename}:${e.lineno}:${e.colno}`,
        });
    });

    window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent): void => {
        reportClientError({
            level: ClientLogLevel.Error,
            source: 'unhandledrejection',
            message: toMessage(e.reason),
            stack: e.reason instanceof Error ? e.reason.stack : undefined,
        });
    });
};
