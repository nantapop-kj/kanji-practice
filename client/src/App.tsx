import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useI18n } from '@/i18n';
import { AppRoutes } from '@/routes/AppRoutes';
import './App.css';

export const App = () => {
    const { t } = useI18n();

    useEffect(() => {
        document.title = `${t('appName')} — ${t('tagline')}`;
    }, [t]);

    return (
        <div className="wrap">
            <Header />
            <AppRoutes />
        </div>
    );
};
