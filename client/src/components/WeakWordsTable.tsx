import { useMemo } from 'react';
import { useI18n } from '@/i18n';
import type { StatsWord } from '@/types/stats';

interface WeakWordsTableProps {
    words: StatsWord[];
}

const percent = (correct: number, total: number): number => (total ? Math.round((correct / total) * 100) : 0);

const Score = ({ correct, wrong }: { correct: number; wrong: number }) =>
    correct + wrong === 0 ? (
        <span className="stats-none">–</span>
    ) : (
        <span className="stats-score">
            <span className="ok">{correct}</span>
            <span className="sep">/</span>
            <span className="ng">{wrong}</span>
        </span>
    );

export const WeakWordsTable = ({ words }: WeakWordsTableProps) => {
    const { t, language } = useI18n();

    const dateFormat = useMemo(
        () => new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'medium' }),
        [language],
    );

    return (
        <div className="table-scroll">
            <table className="stats-table">
                <thead>
                    <tr>
                        <th>{t('colWord')}</th>
                        <th>{t('colMeaning')}</th>
                        <th className="num">{t('colRead')}</th>
                        <th className="num">{t('colMean')}</th>
                        <th className="num">{t('colAccuracy')}</th>
                        <th className="num">{t('colLastAnswered')}</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((w) => {
                        const correct = w.readCorrect + w.meanCorrect;
                        const total = correct + w.readWrong + w.meanWrong;
                        const accuracy = percent(correct, total);
                        const meanings = language === 'en' && w.meaningsEn.length ? w.meaningsEn : w.meaningsTh;

                        return (
                            <tr key={w.wordId}>
                                <td>
                                    <span className="kj" lang="ja">
                                        {w.kanji}
                                    </span>
                                    <span className="rd" lang="ja">
                                        {w.reading}
                                    </span>
                                </td>
                                <td className="stats-meaning">
                                    <span>{meanings.join(' / ')}</span>
                                    <span className="stats-tags">
                                        <span className={`badge xs level-${w.level}`}>{w.level}</span>
                                        {w.weak && <span className="badge xs hot">{t('weakBadge')}</span>}
                                    </span>
                                </td>
                                <td className="num">
                                    <Score correct={w.readCorrect} wrong={w.readWrong} />
                                </td>
                                <td className="num">
                                    <Score correct={w.meanCorrect} wrong={w.meanWrong} />
                                </td>
                                <td className="num">
                                    <span className="stats-accuracy">
                                        {accuracy}%
                                        <span className="bar" aria-hidden="true">
                                            <i style={{ width: `${accuracy}%` }} />
                                        </span>
                                    </span>
                                </td>
                                <td className="num stats-date">
                                    {w.lastAnsweredAt ? dateFormat.format(new Date(w.lastAnsweredAt)) : '–'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
