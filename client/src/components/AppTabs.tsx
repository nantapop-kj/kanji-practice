import type { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, useI18n } from '@/contexts';
import { Paths } from '@/routes/paths';
import type { TabItem } from '@/types';

const Tabs: TabItem[] = [
    { to: Paths.quiz, label: 'tabQuiz' },
    { to: Paths.stats, label: 'tabStats' },
    { to: Paths.adminWords, label: 'tabWords', adminOnly: true },
    { to: Paths.adminUsers, label: 'tabUsers', adminOnly: true },
];

export const AppTabs = (): JSX.Element | null => {
    const { t } = useI18n();
    const { user, isAdmin } = useAuth();

    if (!user) return null;

    const visible: TabItem[] = Tabs.filter((tab: TabItem): boolean => !tab.adminOnly || isAdmin);
    if (visible.length < 2) return null;

    return (
        <nav className="tabs">
            {visible.map(
                (tab: TabItem): JSX.Element => (
                    <NavLink key={tab.to} to={tab.to}>
                        {t(tab.label)}
                    </NavLink>
                ),
            )}
        </nav>
    );
};
