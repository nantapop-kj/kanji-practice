import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useI18n } from '@/i18n';

interface TypingFormProps {
    lang: 'th' | 'en';
    disabled: boolean;
    answered: boolean;
    onSubmit: (answer: string) => void;
}

export const TypingForm = ({ lang, disabled, answered, onSubmit }: TypingFormProps) => {
    const { t } = useI18n();
    const [value, setValue] = useState('');
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!answered) {
            setValue('');
            input.current?.focus();
        }
    }, [answered]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
    };

    return (
        <form className="typebox" onSubmit={handleSubmit} autoComplete="off">
            <input
                ref={input}
                lang={lang}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={lang === 'en' ? t('typePhEn') : t('typePhTh')}
                aria-label={t('yourAnswer')}
                disabled={disabled || answered}
                maxLength={200}
            />
            <button className="btn" disabled={disabled || answered || !value.trim()}>
                {t('submitAnswer')}
            </button>
        </form>
    );
};
