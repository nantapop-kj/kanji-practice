import { Navigate, Outlet } from 'react-router-dom';
import { PageLoading } from '@/components/PageLoading';
import { useAuth } from '@/contexts/AuthContext';
import { Paths } from '@/routes/paths';

export const GuestRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <PageLoading />;
    if (user) return <Navigate to={Paths.quiz} replace />;

    return <Outlet />;
};
