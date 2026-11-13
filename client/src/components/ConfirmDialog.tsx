import { useEffect, useRef, type JSX, type MouseEvent, type RefObject, type SyntheticEvent } from 'react';
import type { ConfirmDialogProps } from '@/types';
import { Spinner } from './Spinner';
import './ConfirmDialog.css';

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
}: ConfirmDialogProps): JSX.Element => {
    const ref: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);

    useEffect((): void => {
        const dialog: HTMLDialogElement | null = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            className="confirm-dialog"
            aria-labelledby="confirm-dialog-title"
            onCancel={(e: SyntheticEvent<HTMLDialogElement>): void => {
                e.preventDefault();
                if (!busy) onCancel();
            }}
            onClick={(e: MouseEvent<HTMLDialogElement>): void => {
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
