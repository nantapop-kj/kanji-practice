import { useI18n } from '@/i18n';
import type { Question } from '@/types/quiz';

export const QuestionCard = ({ question }: { question: Question }) => {
    const { t } = useI18n();
    const isRead = question.qtype === 'read';

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
                {isRead ? t('askRead') : question.lang === 'en' ? t('askMeanEn') : t('askMeanTh')}
            </div>
        </>
    );
};
