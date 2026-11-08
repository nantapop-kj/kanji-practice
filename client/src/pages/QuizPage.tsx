import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';

export const QuizPage = () => {
    const { t } = useI18n();
    const { user } = useAuth();

    return (
        <main className="card">
            <h2>{t('quizWelcome', { name: user?.name ?? '' })}</h2>
            <p className="hint">{t('quizComingSoon')}</p>
        </main>
    );
};
