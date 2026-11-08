import { LevelPicker } from '@/components/LevelPicker';
import { Segmented } from '@/components/Segmented';
import { useI18n } from '@/i18n';
import type { AnswerMode, QuestionTypeFilter, QuizPrefs } from '@/types/quiz';
import type { LevelCounts } from '@/types/word';

interface QuizSettingsProps {
    prefs: QuizPrefs;
    counts: LevelCounts | null;
    onChange: (next: Partial<QuizPrefs>) => void;
}

export const QuizSettings = ({ prefs, counts, onChange }: QuizSettingsProps) => {
    const { t } = useI18n();
    const typing = prefs.mode === 'typing';

    return (
        <div className="card settings">
            <div className="settings-row">
                <span className="lbl">{t('level')}</span>
                <LevelPicker value={prefs.levels} counts={counts} onChange={(levels) => onChange({ levels })} />
            </div>
            <div className="settings-row">
                <span className="lbl">{t('quizMode')}</span>
                <Segmented<AnswerMode>
                    label={t('quizMode')}
                    value={prefs.mode}
                    onChange={(mode) => onChange({ mode })}
                    options={[
                        { value: 'choice', label: t('modeChoice') },
                        { value: 'typing', label: t('modeTyping') },
                    ]}
                />
            </div>
            <div className="settings-row">
                <span className="lbl">{t('quizType')}</span>
                <Segmented<QuestionTypeFilter>
                    label={t('quizType')}
                    value={typing ? 'mean' : prefs.type}
                    onChange={(type) => onChange({ type })}
                    options={[
                        { value: 'mix', label: t('typeMix'), disabled: typing },
                        { value: 'read', label: t('typeRead'), disabled: typing },
                        { value: 'mean', label: t('typeMean') },
                    ]}
                />
                {typing && <span className="hint">{t('typingHint')}</span>}
            </div>
            <label className="toggle">
                <input type="checkbox" checked={prefs.focus} onChange={(e) => onChange({ focus: e.target.checked })} />
                {t('focusWeak')}
            </label>
        </div>
    );
};
