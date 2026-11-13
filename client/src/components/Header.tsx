import type { JSX } from 'react';
import { Link, useMatch, useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuth, useI18n } from '@/contexts';
import { Role } from '@/enums';
import { Paths } from '@/routes/paths';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

export const Header = (): JSX.Element => {
    const { t } = useI18n();
    const { user, loading, logout } = useAuth();
    const navigate: NavigateFunction = useNavigate();
    const isLoginPage: boolean = useMatch(Paths.login) !== null;

    const handleLogout = async (): Promise<void> => {
        await logout();
        navigate(Paths.login, { replace: true });
    };

    return (
        <header>
            <Link className="brand" to={user ? Paths.quiz : Paths.home}>
                <div className="hanko" lang="ja">漢</div>
                <div>
                    <h1>{t('appName')}</h1>
                    <small>{t('tagline')}</small>
                </div>
            </Link>
            <div className="header-right">
                {user && (
                    <div className="who">
                        <span className="name">{user.name || user.email}</span>
                        {user.role === Role.Admin && <span className="badge">admin</span>}
                        <button className="link" onClick={(): void => void handleLogout()}>
                            {t('logout')}
                        </button>
                    </div>
                )}
                <LanguageToggle />
                <ThemeToggle />
                {!user && !loading && !isLoginPage && (
                    <Link className="btn sm" to={Paths.login}>
                        {t('login')}
                    </Link>
                )}
            </div>
        </header>
    );
};
