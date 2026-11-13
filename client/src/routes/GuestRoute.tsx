import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PageLoading } from '@/components';
import { useAuth } from '@/contexts';
import { Paths } from './paths';

export const GuestRoute = (): JSX.Element => {
    const { user, loading } = useAuth();

    if (loading) return <PageLoading />;
    if (user) return <Navigate to={Paths.quiz} replace />;

    return <Outlet />;
};
