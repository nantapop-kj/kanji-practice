import type { JSX } from 'react';
import { useI18n } from '@/contexts';
import { JlptLevel, JlptLevels } from '@/enums';
import type { LevelPickerProps } from '@/types';

export const LevelPicker = ({ value, counts, onChange }: LevelPickerProps): JSX.Element => {
    const { t } = useI18n();
    const allSelected: boolean = value.length === JlptLevels.length;

    const toggle = (level: JlptLevel): void => {
        if (value.includes(level)) {
            if (value.length > 1) onChange(value.filter((l: JlptLevel): boolean => l !== level));
            return;
        }
        onChange(JlptLevels.filter((l: JlptLevel): boolean => l === level || value.includes(l)));
    };

    return (
        <div className="level-picker">
            <div className="level-chips" role="group" aria-label={t('level')}>
                {JlptLevels.map((level: JlptLevel): JSX.Element => {
                    const count: number | undefined = counts?.[level];
                    const selected: boolean = value.includes(level);
                    return (
                        <button
                            key={level}
                            type="button"
                            className="level-chip"
                            aria-pressed={selected}
                            disabled={count === 0 && !selected}
                            title={count === undefined ? level : t('wordsCount', { n: count })}
                            onClick={(): void => toggle(level)}
                        >
                            <b>{level}</b>
                            {count !== undefined && <small>{count.toLocaleString()}</small>}
                        </button>
                    );
                })}
            </div>
            <div className="level-scale">
                <span>{t('easy')}</span>
                <button
                    type="button"
                    className="link"
                    onClick={(): void => onChange(allSelected ? [JlptLevel.N5] : [...JlptLevels])}
                >
                    {allSelected ? t('onlyN5') : t('selectAllLevels')}
                </button>
                <span>{t('hard')}</span>
            </div>
        </div>
    );
};
