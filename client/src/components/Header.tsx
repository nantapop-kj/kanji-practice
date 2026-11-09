import { Link, useMatch, useNavigate } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { Paths } from '@/routes/paths';
import './Header.css';

export const Header = () => {
    const { t } = useI18n();
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const isLoginPage = useMatch(Paths.login) !== null;

    const handleLogout = async () => {
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
                        {user.role === 'admin' && <span className="badge">admin</span>}
                        <button className="link" onClick={handleLogout}>
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
