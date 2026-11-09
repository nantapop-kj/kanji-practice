import { useEffect, useRef, type ReactNode } from 'react';
import { Spinner } from '@/components/Spinner';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    children?: ReactNode;
    confirmLabel: string;
    cancelLabel: string;
    busy?: boolean;
    error?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({
    open,
    title,
    children,
    confirmLabel,
    cancelLabel,
    busy = false,
    error,
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            className="confirm-dialog"
            aria-labelledby="confirm-dialog-title"
            onCancel={(e) => {
                e.preventDefault();
                if (!busy) onCancel();
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !busy) onCancel();
            }}
        >
            <div className="confirm-dialog-body">
                <h3 id="confirm-dialog-title">{title}</h3>
                {children}
                {error && <div className="msg ng">{error}</div>}
                <div className="confirm-dialog-actions">
                    <button type="button" className="btn ghost sm" onClick={onCancel} disabled={busy} autoFocus>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`btn sm${danger ? ' danger-solid' : ''}`}
                        onClick={onConfirm}
                        disabled={busy}
                    >
                        {busy && <Spinner />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </dialog>
    );
};
