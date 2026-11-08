const ClientLogUrl = '/api/v1/client-logs';
const MaxReportsPerPage = 10;
const Limits = { message: 2000, stack: 8000, url: 500 } as const;

type ClientLogLevel = 'error' | 'warn';

interface ClientErrorReport {
    level: ClientLogLevel;
    message: string;
    source: string;
    stack?: string;
}

let sent = 0;
const seen = new Set<string>();

export const reportClientError = ({ level, message, source, stack }: ClientErrorReport): void => {
    const key = `${source}|${message}`;
    if (sent >= MaxReportsPerPage || seen.has(key)) return;
    seen.add(key);
    sent++;

    const body = {
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
    }).catch(() => undefined);
};

const toMessage = (value: unknown): string => (value instanceof Error ? `${value.name}: ${value.message}` : String(value));

export const installGlobalErrorReporting = (): void => {
    window.addEventListener('error', (e) => {
        reportClientError({
            level: 'error',
            source: 'window.onerror',
            message: e.error ? toMessage(e.error) : e.message || 'Script error',
            stack: e.error instanceof Error ? e.error.stack : `${e.filename}:${e.lineno}:${e.colno}`,
        });
    });

    window.addEventListener('unhandledrejection', (e) => {
        reportClientError({
            level: 'error',
            source: 'unhandledrejection',
            message: toMessage(e.reason),
            stack: e.reason instanceof Error ? e.reason.stack : undefined,
        });
    });
};
