import { useEffect, useState, type JSX } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmDialog, Pagination, Spinner, WordForm, WordTable } from '@/components';
import { useI18n } from '@/contexts';
import { JlptLevel, JlptLevels } from '@/enums';
import { useDebounce, useWords } from '@/hooks';
import { apiErrorMessage } from '@/lib';
import { wordsApi } from '@/services';
import type { LevelFilter, Word, WordListQuery, WordsPageParams } from '@/types';
import './AdminWordsPage.css';

const PageSizes: readonly number[] = [10, 20, 50, 100];
const DefaultPageSize = 20;
const SearchDebounceMs = 300;

const toPositiveInt = (value: string | null, fallback: number): number => {
    const n: number = Number(value);
    return Number.isSafeInteger(n) && n >= 1 ? n : fallback;
};

const toLevel = (value: string | null): LevelFilter =>
    JlptLevels.includes(value as JlptLevel) ? (value as JlptLevel) : '';

export const AdminWordsPage = (): JSX.Element => {
    const { t } = useI18n();
    const [params, setParams] = useSearchParams();
    const page: number = toPositiveInt(params.get('page'), 1);
    const sizeParam: number = toPositiveInt(params.get('pageSize'), DefaultPageSize);
    const pageSize: number = PageSizes.includes(sizeParam) ? sizeParam : DefaultPageSize;
    const level: LevelFilter = toLevel(params.get('level'));
    const search: string = params.get('search') ?? '';
    const [searchInput, setSearchInput] = useState<string>(search);
    const debouncedSearch: string = useDebounce<string>(searchInput.trim(), SearchDebounceMs);
    const { data, loading, error, reload } = useWords({ page, pageSize, search, level });
    const [editing, setEditing] = useState<Word | null>(null);
    const [deleting, setDeleting] = useState<Word | null>(null);
    const [deleteBusy, setDeleteBusy] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string>('');

    const updateParams = (next: WordsPageParams): void => {
        const merged: WordListQuery = { page, pageSize, search, level, ...next };
        const query: Record<string, string> = {
            page: String(merged.page),
            pageSize: String(merged.pageSize),
        };
        if (merged.search) query.search = merged.search;
        if (merged.level) query.level = merged.level;
        setParams(query, { replace: next.search !== undefined });
    };

    useEffect((): void => {
        setSearchInput((current: string): string => (current.trim() === search ? current : search));
    }, [search]);

    useEffect((): void => {
        if (debouncedSearch !== search) updateParams({ search: debouncedSearch, page: 1 });
    }, [debouncedSearch]);

    useEffect((): void => {
        if (data && data.totalPages > 0 && page > data.totalPages) {
            updateParams({ page: data.totalPages });
        }
    }, [data, page]);

    const handleEdit = (word: Word): void => {
        setEditing(word);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openDelete = (word: Word): void => {
        setDeleteError('');
        setDeleting(word);
    };

    const closeDelete = (): void => {
        if (deleteBusy) return;
        setDeleting(null);
        setDeleteError('');
    };

    const confirmDelete = async (): Promise<void> => {
        if (!deleting) return;

        setDeleteBusy(true);
        setDeleteError('');
        try {
            await wordsApi.remove(deleting.id);
            if (editing?.id === deleting.id) setEditing(null);
            setDeleting(null);
            reload();
        } catch (err) {
            setDeleteError(apiErrorMessage(err, t));
        } finally {
            setDeleteBusy(false);
        }
    };

    return (
        <main className="words-admin">
            <section className="card">
                <WordForm
                    editing={editing}
                    onSaved={(): void => {
                        setEditing(null);
                        reload();
                    }}
                    onCancel={(): void => setEditing(null)}
                />
            </section>
            <section className="card">
                {error ? (
                    <div className="empty">
                        <p className="msg ng">{apiErrorMessage(error, t)}</p>
                        <button className="btn sm" onClick={reload}>
                            {t('retry')}
                        </button>
                    </div>
                ) : !data ? (
                    <div className="empty" role="status">
                        <Spinner />
                        {t('loading')}
                    </div>
                ) : (
                    <>
                        <WordTable
                            words={data.items}
                            total={data.total}
                            levelCounts={data.levelCounts}
                            search={searchInput}
                            level={level}
                            loading={loading}
                            selectedId={editing?.id}
                            onSearchChange={setSearchInput}
                            onLevelChange={(next: LevelFilter): void => updateParams({ level: next, page: 1 })}
                            onEdit={handleEdit}
                            onDelete={openDelete}
                        />
                        {data.total > 0 && (
                            <Pagination
                                page={Math.min(page, Math.max(data.totalPages, 1))}
                                pageSize={pageSize}
                                total={data.total}
                                totalPages={data.totalPages}
                                pageSizes={PageSizes}
                                disabled={loading}
                                onPageChange={(next: number): void => updateParams({ page: next })}
                                onPageSizeChange={(next: number): void => updateParams({ pageSize: next, page: 1 })}
                            />
                        )}
                    </>
                )}
            </section>
            <ConfirmDialog
                open={deleting !== null}
                title={t('deleteWordTitle')}
                confirmLabel={t('delete')}
                cancelLabel={t('cancel')}
                busy={deleteBusy}
                error={deleteError}
                danger
                onConfirm={(): void => void confirmDelete()}
                onCancel={closeDelete}
            >
                {deleting && (
                    <>
                        <div className="delete-preview">
                            <span className="kj" lang="ja">
                                {deleting.kanji}
                            </span>
                            <span className="rd" lang="ja">
                                {deleting.reading}
                            </span>
                            <span className="hint">
                                {[deleting.meaningsTh.join(' / '), deleting.meaningsEn.join(' / ')]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </span>
                        </div>
                        <p className="hint">{t('deleteWordBody')}</p>
                    </>
                )}
            </ConfirmDialog>
        </main>
    );
};
