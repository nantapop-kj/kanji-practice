import type { JSX } from 'react';
import { useI18n } from '@/contexts';
import type { SessionScoreCardProps } from '@/types';

export const SessionScoreCard = ({ score, onReset }: SessionScoreCardProps): JSX.Element => {
    const { t } = useI18n();
    const accuracy: number = score.answered ? Math.round((score.correct / score.answered) * 100) : 0;

    return (
        <div className="session-card">
            <div className="session">
                <div>
                    <b>
                        {score.correct}/{score.answered}
                    </b>
                    <span>{t('sessionRight')}</span>
                </div>
                <div>
                    <b>{accuracy}%</b>
                    <span>{t('sessionAccuracy')}</span>
                </div>
                <div>
                    <b>{score.streak}</b>
                    <span>{t('sessionStreak')}</span>
                </div>
                <div>
                    <b>{score.bestStreak}</b>
                    <span>{t('sessionBest')}</span>
                </div>
            </div>
            {score.answered > 0 && (
                <button type="button" className="link session-reset" onClick={onReset}>
                    {t('sessionReset')}
                </button>
            )}
        </div>
    );
};
