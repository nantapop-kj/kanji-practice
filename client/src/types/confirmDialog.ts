import type { ReactNode } from 'react';

export interface ConfirmDialogProps {
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
