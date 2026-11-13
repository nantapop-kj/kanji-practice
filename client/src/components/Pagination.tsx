import type { ChangeEvent, JSX } from 'react';
import { useI18n } from '@/contexts';
import type { PageItem, PaginationProps } from '@/types';
import './Pagination.css';

const SiblingCount = 1;

const pageItems = (page: number, totalPages: number): PageItem[] => {
    const pages: Set<number> = new Set<number>([1, totalPages]);
    for (let p = page - SiblingCount; p <= page + SiblingCount; p++) {
        if (p >= 1 && p <= totalPages) pages.add(p);
    }

    const sorted: number[] = [...pages].sort((a: number, b: number): number => a - b);
    const items: PageItem[] = [];
    sorted.forEach((p: number, i: number): void => {
        if (i > 0 && p - sorted[i - 1] > 1) items.push('gap');
        items.push(p);
    });
    return items;
};

export const Pagination = ({
    page,
    pageSize,
    total,
    totalPages,
    pageSizes,
    disabled = false,
    onPageChange,
    onPageSizeChange,
}: PaginationProps): JSX.Element => {
    const { t } = useI18n();
    const from: number = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to: number = Math.min(page * pageSize, total);

    return (
        <nav className="pagination" aria-label={t('pagination')}>
            <span className="hint">{t('pageRange', { from, to, total })}</span>
            <div className="pagination-controls">
                <label className="pagination-size">
                    <span className="lbl">{t('perPage')}</span>
                    <select
                        className="select"
                        value={pageSize}
                        disabled={disabled}
                        onChange={(e: ChangeEvent<HTMLSelectElement>): void => onPageSizeChange(Number(e.target.value))}
                    >
                        {pageSizes.map(
                            (size: number): JSX.Element => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ),
                        )}
                    </select>
                </label>
                <div className="pagination-pages">
                    <button
                        type="button"
                        className="btn ghost sm"
                        onClick={(): void => onPageChange(page - 1)}
                        disabled={disabled || page <= 1}
                        aria-label={t('prevPage')}
                    >
                        ‹
                    </button>
                    {pageItems(page, totalPages).map(
                        (item: PageItem, i: number): JSX.Element =>
                            item === 'gap' ? (
                                <span key={`gap-${i}`} className="pagination-gap" aria-hidden="true">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    type="button"
                                    className={`btn sm${item === page ? '' : ' ghost'}`}
                                    onClick={(): void => onPageChange(item)}
                                    disabled={disabled}
                                    aria-current={item === page ? 'page' : undefined}
                                >
                                    {item}
                                </button>
                            ),
                    )}
                    <button
                        type="button"
                        className="btn ghost sm"
                        onClick={(): void => onPageChange(page + 1)}
                        disabled={disabled || page >= totalPages}
                        aria-label={t('nextPage')}
                    >
                        ›
                    </button>
                </div>
            </div>
        </nav>
    );
};
