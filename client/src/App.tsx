import { useEffect, type JSX } from 'react';
import { AppTabs, Header } from '@/components';
import { useI18n } from '@/contexts';
import { AppRoutes } from '@/routes';
import './App.css';

export const App = (): JSX.Element => {
    const { t } = useI18n();

    useEffect((): void => {
        document.title = `${t('appName')} — ${t('tagline')}`;
    }, [t]);

    return (
        <div className="wrap">
            <Header />
            <AppTabs />
            <AppRoutes />
        </div>
    );
};
