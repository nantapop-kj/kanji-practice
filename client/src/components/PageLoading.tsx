import { Spinner } from '@/components/Spinner';
import { useI18n } from '@/i18n';

export const PageLoading = () => {
    const { t } = useI18n();

    return (
        <div className="card center" role="status">
            <Spinner />
            {t('loading')}
        </div>
    );
};
