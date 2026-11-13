import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX, type RefObject } from 'react';
import { useI18n } from '@/contexts';
import { Language } from '@/enums';
import type { TypingFormProps } from '@/types';

export const TypingForm = ({ lang, disabled, answered, onSubmit }: TypingFormProps): JSX.Element => {
    const { t } = useI18n();
    const [value, setValue] = useState<string>('');
    const input: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    useEffect((): void => {
        if (!answered) {
            setValue('');
            input.current?.focus();
        }
    }, [answered]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
    };

    return (
        <form className="typebox" onSubmit={handleSubmit} autoComplete="off">
            <input
                ref={input}
                lang={lang}
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value)}
                placeholder={lang === Language.En ? t('typePhEn') : t('typePhTh')}
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
