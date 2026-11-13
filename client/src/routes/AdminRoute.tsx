import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { Paths } from './paths';

export const AdminRoute = (): JSX.Element => {
    const { isAdmin } = useAuth();

    if (!isAdmin) return <Navigate to={Paths.quiz} replace />;

    return <Outlet />;
};
