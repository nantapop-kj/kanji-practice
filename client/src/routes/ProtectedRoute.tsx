import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PageLoading } from '@/components/PageLoading';
import { useAuth } from '@/contexts/AuthContext';
import { Paths } from '@/routes/paths';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <PageLoading />;
    if (!user) return <Navigate to={Paths.login} replace state={{ from: location }} />;

    return <Outlet />;
};
