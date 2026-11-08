import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Paths } from '@/routes/paths';

export const AdminRoute = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) return <Navigate to={Paths.quiz} replace />;

    return <Outlet />;
};
