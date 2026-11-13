import { useMemo, type JSX } from 'react';
import { useI18n } from '@/contexts';
import { Language } from '@/enums';
import type { ScoreProps, StatsWord, WeakWordsTableProps } from '@/types';

const percent = (correct: number, total: number): number => (total ? Math.round((correct / total) * 100) : 0);

const Score = ({ correct, wrong }: ScoreProps): JSX.Element =>
    correct + wrong === 0 ? (
        <span className="stats-none">–</span>
    ) : (
        <span className="stats-score">
            <span className="ok">{correct}</span>
            <span className="sep">/</span>
            <span className="ng">{wrong}</span>
        </span>
    );

export const WeakWordsTable = ({ words }: WeakWordsTableProps): JSX.Element => {
    const { t, language } = useI18n();

    const dateFormat = useMemo(
        (): Intl.DateTimeFormat =>
            new Intl.DateTimeFormat(language === Language.Th ? 'th-TH' : 'en-US', { dateStyle: 'medium' }),
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
                    {words.map((w: StatsWord): JSX.Element => {
                        const correct: number = w.readCorrect + w.meanCorrect;
                        const total: number = correct + w.readWrong + w.meanWrong;
                        const accuracy: number = percent(correct, total);
                        const meanings: string[] = language === Language.En && w.meaningsEn.length ? w.meaningsEn : w.meaningsTh;

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
