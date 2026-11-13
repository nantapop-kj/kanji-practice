import { useMemo, type ChangeEvent, type JSX } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '@/components';
import { useAuth, useI18n } from '@/contexts';
import { HttpStatus, Language, Role } from '@/enums';
import { useUsers } from '@/hooks';
import { ApiError } from '@/services';
import type { PublicUser, UsersPageParams } from '@/types';
import './AdminUsersPage.css';

const PageSizes: readonly number[] = [10, 20, 50, 100];
const DefaultPageSize = 20;

const toPositiveInt = (value: string | null, fallback: number): number => {
    const n: number = Number(value);
    return Number.isSafeInteger(n) && n >= 1 ? n : fallback;
};

export const AdminUsersPage = (): JSX.Element => {
    const { t, language } = useI18n();
    const { user: me } = useAuth();
    const [params, setParams] = useSearchParams();

    const page: number = toPositiveInt(params.get('page'), 1);
    const sizeParam: number = toPositiveInt(params.get('pageSize'), DefaultPageSize);
    const pageSize: number = PageSizes.includes(sizeParam) ? sizeParam : DefaultPageSize;

    const { data, loading, error, reload } = useUsers({ page, pageSize });

    const dateFormat = useMemo(
        (): Intl.DateTimeFormat =>
            new Intl.DateTimeFormat(language === Language.Th ? 'th-TH' : 'en-US', { dateStyle: 'medium' }),
        [language],
    );

    const goTo = (next: UsersPageParams): void => {
        setParams({
            page: String(next.page ?? page),
            pageSize: String(next.pageSize ?? pageSize),
        });
    };

    const totalPages: number = Math.max(data?.totalPages ?? 1, 1);
    const firstRow: number = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
    const lastRow: number = data ? firstRow + data.items.length - (data.items.length > 0 ? 1 : 0) : 0;
    const errorText: string =
        error instanceof ApiError && error.status === HttpStatus.Forbidden ? t('usersForbidden') : t('usersLoadError');

    return (
        <main className="admin-users">
            <div className="admin-users-head">
                <div>
                    <h2>{t('usersTitle')}</h2>
                    <p className="hint">{t('usersHint')}</p>
                </div>
                <button className="btn ghost sm" onClick={reload} disabled={loading}>
                    {t('refresh')}
                </button>
            </div>
            <section className="kpis">
                <div className="kpi">
                    <div className="v">{data ? data.total.toLocaleString() : '–'}</div>
                    <div className="l">{t('usersTotal')}</div>
                </div>
                <div className="kpi">
                    <div className="v">
                        {data ? data.items.filter((u: PublicUser): boolean => u.role === Role.Admin).length : '–'}
                    </div>
                    <div className="l">{t('usersAdminsOnPage')}</div>
                </div>
                <div className="kpi">
                    <div className="v">{data ? `${data.page}/${totalPages}` : '–'}</div>
                    <div className="l">{t('usersPage')}</div>
                </div>
            </section>
            <section className="card admin-users-card">
                {error ? (
                    <div className="empty">
                        <p className="msg ng">{errorText}</p>
                        <button className="btn sm" onClick={reload}>
                            {t('retry')}
                        </button>
                    </div>
                ) : !data ? (
                    <div className="empty" role="status">
                        <Spinner />
                        {t('loading')}
                    </div>
                ) : data.items.length === 0 ? (
                    <div className="empty">
                        <h2>{t('usersEmpty')}</h2>
                    </div>
                ) : (
                    <div className="table-scroll" aria-busy={loading}>
                        <table className={loading ? 'is-loading' : undefined}>
                            <thead>
                                <tr>
                                    <th>{t('displayName')}</th>
                                    <th>{t('email')}</th>
                                    <th>{t('usersRole')}</th>
                                    <th>{t('usersCreatedAt')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map(
                                    (u: PublicUser): JSX.Element => (
                                        <tr key={u.id}>
                                            <td>
                                                {u.name}
                                                {u.id === me?.id && (
                                                    <span className="badge xs admin-users-you">{t('usersYou')}</span>
                                                )}
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge xs${u.role === Role.Admin ? ' hot' : ''}`}>
                                                    {u.role === Role.Admin ? t('roleAdmin') : t('roleUser')}
                                                </span>
                                            </td>
                                            <td>{dateFormat.format(new Date(u.createdAt))}</td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {data && data.total > 0 && (
                    <footer className="admin-users-pager">
                        <span className="hint">
                            {t('usersRange', { from: firstRow, to: lastRow, total: data.total })}
                        </span>
                        <div className="row">
                            <label className="lbl" htmlFor="page-size">
                                {t('usersPerPage')}
                            </label>
                            <select
                                id="page-size"
                                className="select"
                                value={pageSize}
                                onChange={(e: ChangeEvent<HTMLSelectElement>): void =>
                                    goTo({ page: 1, pageSize: Number(e.target.value) })
                                }
                            >
                                {PageSizes.map(
                                    (size: number): JSX.Element => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ),
                                )}
                            </select>
                            <button
                                className="btn ghost sm"
                                onClick={(): void => goTo({ page: page - 1 })}
                                disabled={loading || page <= 1}
                            >
                                {t('prevPage')}
                            </button>
                            <button
                                className="btn ghost sm"
                                onClick={(): void => goTo({ page: page + 1 })}
                                disabled={loading || page >= totalPages}
                            >
                                {t('nextPage')}
                            </button>
                        </div>
                    </footer>
                )}
            </section>
        </main>
    );
};
