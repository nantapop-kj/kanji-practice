import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ClientLogLevel } from '@/enums';
import { reportClientError } from '@/services';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '@/types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { failed: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        reportClientError({
            level: ClientLogLevel.Error,
            source: 'react',
            message: `${error.name}: ${error.message}`,
            stack: `${error.stack ?? ''}\n--- component stack ---${info.componentStack ?? ''}`,
        });
    }

    render(): ReactNode {
        if (!this.state.failed) return this.props.children;

        return (
            <div className="wrap">
                <div className="card empty" role="alert">
                    <h2>เกิดข้อผิดพลาด · Something went wrong</h2>
                    <p>ระบบบันทึกปัญหานี้ไว้แล้ว ลองโหลดหน้าใหม่อีกครั้ง · The problem has been logged. Please reload the page.</p>
                    <button className="btn" onClick={(): void => location.reload()}>
                        โหลดใหม่ · Reload
                    </button>
                </div>
            </div>
        );
    }
}
