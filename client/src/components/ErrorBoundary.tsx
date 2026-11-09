import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportClientError } from '@/services/error-reporter';

interface ErrorBoundaryState {
    failed: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    state: ErrorBoundaryState = { failed: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        reportClientError({
            level: 'error',
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
                    <button className="btn" onClick={() => location.reload()}>
                        โหลดใหม่ · Reload
                    </button>
                </div>
            </div>
        );
    }
}
