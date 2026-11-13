import type { JSX } from 'react';
import { useI18n } from '@/contexts';
import { Spinner } from './Spinner';

export const PageLoading = (): JSX.Element => {
    const { t } = useI18n();

    return (
        <div className="card center" role="status">
            <Spinner />
            {t('loading')}
        </div>
    );
};
