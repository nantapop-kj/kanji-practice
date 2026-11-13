import type { JSX } from 'react';
import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom';
import { PageLoading } from '@/components';
import { useAuth } from '@/contexts';
import { Paths } from './paths';

export const ProtectedRoute = (): JSX.Element => {
    const { user, loading } = useAuth();
    const location: Location = useLocation();

    if (loading) return <PageLoading />;
    if (!user) return <Navigate to={Paths.login} replace state={{ from: location }} />;

    return <Outlet />;
};
