import type { JSX } from 'react';
import { useI18n } from '@/contexts';
import { Language, QuestionType } from '@/enums';
import type { QuestionCardProps } from '@/types';

export const QuestionCard = ({ question }: QuestionCardProps): JSX.Element => {
    const { t } = useI18n();
    const isRead: boolean = question.qtype === QuestionType.Read;

    return (
        <>
            <div className="q-meta">
                <span className="badge">{isRead ? t('badgeRead') : t('badgeMean')}</span>
                <span className="q-meta-right">
                    {question.wrongCount > 0 && (
                        <span className="badge hot">{t('wrongTimes', { n: question.wrongCount })}</span>
                    )}
                    <span className={`badge level-${question.level}`}>{question.level}</span>
                </span>
            </div>
            <div className="kanji" lang="ja">
                {question.kanji}
            </div>
            <div className="ask">
                {isRead ? t('askRead') : question.lang === Language.En ? t('askMeanEn') : t('askMeanTh')}
            </div>
        </>
    );
};
