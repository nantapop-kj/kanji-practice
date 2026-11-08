import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n, type TKey } from '@/i18n';
import { Paths } from '@/routes/paths';

const Tabs: { to: string; label: TKey; adminOnly?: boolean }[] = [
    { to: Paths.quiz, label: 'tabQuiz' },
    { to: Paths.adminWords, label: 'tabWords', adminOnly: true },
    { to: Paths.adminUsers, label: 'tabUsers', adminOnly: true },
];

export const AppTabs = () => {
    const { t } = useI18n();
    const { user, isAdmin } = useAuth();

    if (!user) return null;

    const visible = Tabs.filter((tab) => !tab.adminOnly || isAdmin);
    if (visible.length < 2) return null;

    return (
        <nav className="tabs">
            {visible.map((tab) => (
                <NavLink key={tab.to} to={tab.to}>
                    {t(tab.label)}
                </NavLink>
            ))}
        </nav>
    );
};
