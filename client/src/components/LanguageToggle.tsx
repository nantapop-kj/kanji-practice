import type { JSX } from 'react';
import { useI18n } from '@/contexts';
import { Language } from '@/enums';
import type { LanguageOption } from '@/types';
import './LanguageToggle.css';

const Options: LanguageOption[] = [
    { value: Language.Th, short: 'TH', full: 'ภาษาไทย' },
    { value: Language.En, short: 'EN', full: 'English' },
];

export const LanguageToggle = (): JSX.Element => {
    const { language, setLanguage, t } = useI18n();

    return (
        <div className="pill-toggle" role="group" aria-label={t('language')}>
            {Options.map(
                (option: LanguageOption): JSX.Element => (
                    <button
                        key={option.value}
                        className="pill-text"
                        aria-pressed={language === option.value}
                        title={option.full}
                        onClick={(): void => setLanguage(option.value)}
                    >
                        {option.short}
                    </button>
                ),
            )}
        </div>
    );
};
