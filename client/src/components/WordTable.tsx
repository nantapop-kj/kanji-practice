import type { ChangeEvent, JSX } from 'react';
import { useI18n } from '@/contexts';
import { IconName, JlptLevel, JlptLevels } from '@/enums';
import type { LevelFilter, Word, WordTableProps } from '@/types';
import { Icon } from './Icon';

export const WordTable = ({
    words,
    total,
    levelCounts,
    search,
    level,
    loading,
    selectedId,
    onSearchChange,
    onLevelChange,
    onEdit,
    onDelete,
}: WordTableProps): JSX.Element => {
    const { t } = useI18n();
    const allCount: number = levelCounts
        ? Object.values(levelCounts).reduce((a: number, b: number): number => a + b, 0)
        : total;

    return (
        <>
            <div className="row words-table-head">
                <h3 className="card-title">{t('allWords', { n: allCount.toLocaleString() })}</h3>
                <div className="row words-table-filters">
                    <select
                        className="select"
                        value={level}
                        onChange={(e: ChangeEvent<HTMLSelectElement>): void => onLevelChange(e.target.value as LevelFilter)}
                        aria-label={t('level')}
                    >
                        <option value="">{t('allLevels')}</option>
                        {JlptLevels.map(
                            (l: JlptLevel): JSX.Element => (
                                <option key={l} value={l}>
                                    {l} ({levelCounts?.[l] ?? 0})
                                </option>
                            ),
                        )}
                    </select>
                    <input
                        className="search"
                        type="search"
                        placeholder={t('search')}
                        value={search}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => onSearchChange(e.target.value)}
                        aria-label={t('search')}
                    />
                </div>
            </div>
            <div className="table-scroll" aria-busy={loading}>
                <table className={`words-table${loading ? ' is-loading' : ''}`}>
                    <tbody>
                        {words.map(
                            (w: Word): JSX.Element => (
                                <tr key={w.id} className={w.id === selectedId ? 'is-selected' : undefined}>
                                    <td>
                                        <span className="kj" lang="ja">
                                            {w.kanji}
                                        </span>
                                        <span className="rd" lang="ja">
                                            {w.reading}
                                        </span>
                                    </td>
                                    <td className="words-meanings">
                                        <span>{w.meaningsTh.join(' / ') || <em className="missing">{t('missingTh')}</em>}</span>
                                        <span className="en">
                                            {w.meaningsEn.join(' / ') || <em className="missing">{t('missingEn')}</em>}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge level-${w.level}`}>{w.level}</span>
                                    </td>
                                    <td className="num">
                                        <div className="words-actions">
                                            <button
                                                type="button"
                                                className="btn ghost sm icon-btn"
                                                onClick={(): void => onEdit(w)}
                                                aria-label={`${t('edit')} ${w.kanji}`}
                                                title={t('edit')}
                                            >
                                                <Icon name={IconName.Edit} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn ghost sm icon-btn danger-hover"
                                                onClick={(): void => onDelete(w)}
                                                aria-label={`${t('delete')} ${w.kanji}`}
                                                title={t('delete')}
                                            >
                                                <Icon name={IconName.Trash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>
            {!loading && words.length === 0 && (
                <div className="hint words-empty">{search || level ? t('noMatch') : t('noWords')}</div>
            )}
        </>
    );
};
