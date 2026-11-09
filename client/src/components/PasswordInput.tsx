import { useState, type InputHTMLAttributes } from 'react';
import { useI18n } from '@/i18n';
import './PasswordInput.css';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const PasswordInput = (props: PasswordInputProps) => {
    const { t } = useI18n();
    const [visible, setVisible] = useState(false);
    const label = visible ? t('hidePassword') : t('showPassword');

    return (
        <div className="password-field">
            <input {...props} type={visible ? 'text' : 'password'} />
            <button
                type="button"
                className="password-toggle"
                onClick={() => setVisible((v) => !v)}
                aria-label={label}
                aria-pressed={visible}
                title={label}
            >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {visible && <path d="M3 3l18 18" />}
                </svg>
            </button>
        </div>
    );
};
