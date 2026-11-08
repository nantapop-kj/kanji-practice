import { useI18n } from '@/i18n';
import { JlptLevels, type JlptLevel } from '@/lib/levels';
import type { LevelCounts } from '@/types/word';

interface LevelPickerProps {
    value: JlptLevel[];
    counts: LevelCounts | null;
    onChange: (levels: JlptLevel[]) => void;
}

export const LevelPicker = ({ value, counts, onChange }: LevelPickerProps) => {
    const { t } = useI18n();
    const allSelected = value.length === JlptLevels.length;

    const toggle = (level: JlptLevel) => {
        if (value.includes(level)) {
            if (value.length > 1) onChange(value.filter((l) => l !== level));
            return;
        }
        onChange(JlptLevels.filter((l) => l === level || value.includes(l)));
    };

    return (
        <div className="level-picker">
            <div className="level-chips" role="group" aria-label={t('level')}>
                {JlptLevels.map((level) => {
                    const count = counts?.[level];
                    const selected = value.includes(level);
                    return (
                        <button
                            key={level}
                            type="button"
                            className="level-chip"
                            aria-pressed={selected}
                            disabled={count === 0 && !selected}
                            title={count === undefined ? level : t('wordsCount', { n: count })}
                            onClick={() => toggle(level)}
                        >
                            <b>{level}</b>
                            {count !== undefined && <small>{count.toLocaleString()}</small>}
                        </button>
                    );
                })}
            </div>
            <div className="level-scale">
                <span>{t('easy')}</span>
                <button type="button" className="link" onClick={() => onChange(allSelected ? ['N5'] : [...JlptLevels])}>
                    {allSelected ? t('onlyN5') : t('selectAllLevels')}
                </button>
                <span>{t('hard')}</span>
            </div>
        </div>
    );
};
