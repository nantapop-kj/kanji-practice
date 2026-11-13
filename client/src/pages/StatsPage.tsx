import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog, Segmented, Spinner, WeakWordsTable } from '@/components';
import { useI18n } from '@/contexts';
import { WordFilter } from '@/enums';
import { useStats } from '@/hooks';
import { apiErrorMessage } from '@/lib';
import { Paths } from '@/routes/paths';
import { statsApi } from '@/services';
import type { LevelStat, StatsWord } from '@/types';
import './StatsPage.css';

const percent = (value: number | null): string => (value === null ? '–' : `${Math.round(value * 100)}%`);

export const StatsPage = (): JSX.Element => {
    const { t } = useI18n();
    const { data, loading, error, reload } = useStats();
    const [filter, setFilter] = useState<WordFilter>(WordFilter.Weak);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [resetting, setResetting] = useState<boolean>(false);
    const [resetError, setResetError] = useState<string>('');

    const handleReset = async (): Promise<void> => {
        setResetting(true);
        setResetError('');
        try {
            await statsApi.reset();
            setConfirmOpen(false);
            reload();
        } catch (err) {
            setResetError(apiErrorMessage(err, t));
        } finally {
            setResetting(false);
        }
    };

    if (error && !data) {
        return (
            <main className="card empty">
                <p className="msg ng">{apiErrorMessage(error, t)}</p>
                <button className="btn sm" onClick={reload}>
                    {t('retry')}
                </button>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="card empty" role="status">
                <Spinner />
                {t('loading')}
            </main>
        );
    }

    const { summary, levels, words } = data;
    const shown: StatsWord[] = filter === WordFilter.Weak ? words.filter((w: StatsWord): boolean => w.weak) : words;

    return (
        <main className={`stats${loading ? ' is-loading' : ''}`}>
            <div className="stats-head">
                <div>
                    <h2>{t('statsTitle')}</h2>
                    <p className="hint">{t('statsHint')}</p>
                </div>
                <button
                    type="button"
                    className="btn ghost sm danger-hover"
                    onClick={(): void => setConfirmOpen(true)}
                    disabled={summary.answered === 0}
                >
                    {t('statsReset')}
                </button>
            </div>
            <section className="kpis stats-kpis">
                <div className="kpi">
                    <div className="v">{summary.answered.toLocaleString()}</div>
                    <div className="l">{t('statsAnswered')}</div>
                </div>
                <div className="kpi">
                    <div className="v">{percent(summary.accuracy)}</div>
                    <div className="l">{t('statsAccuracy')}</div>
                </div>
                <div className="kpi">
                    <div className="v">
                        {summary.practicedWords.toLocaleString()}
                        <small> / {summary.totalWords.toLocaleString()}</small>
                    </div>
                    <div className="l">{t('statsPracticed')}</div>
                </div>
                <div className="kpi">
                    <div className="v">{summary.weakWords.toLocaleString()}</div>
                    <div className="l">{t('statsWeak')}</div>
                </div>
            </section>
            {summary.answered === 0 ? (
                <section className="card empty">
                    <h2>{t('statsEmptyTitle')}</h2>
                    <p>{t('statsEmptyBody')}</p>
                    <Link className="btn sm" to={Paths.quiz}>
                        {t('statsStartPractice')}
                    </Link>
                </section>
            ) : (
                <>
                    <section className="card stats-levels">
                        <h3 className="card-title">{t('statsByLevel')}</h3>
                        {levels.map((l: LevelStat): JSX.Element => {
                            const progress: number = l.totalWords ? (l.practicedWords / l.totalWords) * 100 : 0;
                            return (
                                <div key={l.level} className="stats-level">
                                    <span className={`badge level-${l.level}`}>{l.level}</span>
                                    <div className="stats-level-bar" aria-hidden="true">
                                        <i style={{ width: `${progress}%` }} />
                                    </div>
                                    <span className="stats-level-count">
                                        {t('statsLevelWords', { n: l.practicedWords, total: l.totalWords })}
                                    </span>
                                    <span className="stats-level-acc">
                                        {l.answered ? percent(l.correct / l.answered) : '–'}
                                    </span>
                                </div>
                            );
                        })}
                    </section>
                    <section className="card stats-words">
                        <div className="stats-words-head">
                            <h3 className="card-title">{t('statsWords')}</h3>
                            <Segmented<WordFilter>
                                label={t('statsWords')}
                                value={filter}
                                onChange={setFilter}
                                options={[
                                    { value: WordFilter.Weak, label: t('statsFilterWeak', { n: summary.weakWords }) },
                                    { value: WordFilter.All, label: t('statsFilterAll') },
                                ]}
                            />
                        </div>
                        {shown.length ? (
                            <WeakWordsTable words={shown} />
                        ) : (
                            <p className="hint stats-words-empty">{t('statsNoWeak')}</p>
                        )}
                        {filter === WordFilter.All && summary.practicedWords > words.length && (
                            <p className="hint stats-words-empty">{t('statsWordsLimited', { n: words.length })}</p>
                        )}
                    </section>
                </>
            )}
            <ConfirmDialog
                open={confirmOpen}
                title={t('statsResetTitle')}
                confirmLabel={t('statsReset')}
                cancelLabel={t('cancel')}
                busy={resetting}
                error={resetError}
                danger
                onConfirm={(): void => void handleReset()}
                onCancel={(): void => {
                    if (!resetting) setConfirmOpen(false);
                }}
            >
                <p className="hint">{t('statsResetBody', { n: summary.answered })}</p>
            </ConfirmDialog>
        </main>
    );
};
