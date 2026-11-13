import type { ChangeEvent, JSX } from 'react';
import { useI18n } from '@/contexts';
import { AnswerMode, JlptLevel, QuestionTypeFilter } from '@/enums';
import type { QuizSettingsProps } from '@/types';
import { LevelPicker } from './LevelPicker';
import { Segmented } from './Segmented';

export const QuizSettings = ({ prefs, counts, onChange }: QuizSettingsProps): JSX.Element => {
    const { t } = useI18n();
    const typing: boolean = prefs.mode === AnswerMode.Typing;

    return (
        <div className="card settings">
            <div className="settings-row">
                <span className="lbl">{t('level')}</span>
                <LevelPicker
                    value={prefs.levels}
                    counts={counts}
                    onChange={(levels: JlptLevel[]): void => onChange({ levels })}
                />
            </div>
            <div className="settings-row">
                <span className="lbl">{t('quizMode')}</span>
                <Segmented<AnswerMode>
                    label={t('quizMode')}
                    value={prefs.mode}
                    onChange={(mode: AnswerMode): void => onChange({ mode })}
                    options={[
                        { value: AnswerMode.Choice, label: t('modeChoice') },
                        { value: AnswerMode.Typing, label: t('modeTyping') },
                    ]}
                />
            </div>
            <div className="settings-row">
                <span className="lbl">{t('quizType')}</span>
                <Segmented<QuestionTypeFilter>
                    label={t('quizType')}
                    value={typing ? QuestionTypeFilter.Mean : prefs.type}
                    onChange={(type: QuestionTypeFilter): void => onChange({ type })}
                    options={[
                        { value: QuestionTypeFilter.Mix, label: t('typeMix'), disabled: typing },
                        { value: QuestionTypeFilter.Read, label: t('typeRead'), disabled: typing },
                        { value: QuestionTypeFilter.Mean, label: t('typeMean') },
                    ]}
                />
                {typing && <span className="hint">{t('typingHint')}</span>}
            </div>
            <label className="toggle">
                <input
                    type="checkbox"
                    checked={prefs.focus}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => onChange({ focus: e.target.checked })}
                />
                {t('focusWeak')}
            </label>
        </div>
    );
};
