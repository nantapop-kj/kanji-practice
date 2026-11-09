import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminWordsPage } from '@/pages/AdminWordsPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { QuizPage } from '@/pages/QuizPage';
import { StatsPage } from '@/pages/StatsPage';
import { AdminRoute } from '@/routes/AdminRoute';
import { GuestRoute } from '@/routes/GuestRoute';
import { Paths } from '@/routes/paths';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export const AppRoutes = () => {
    const { key } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType !== 'POP') window.scrollTo(0, 0);
    }, [key, navigationType]);

    return (
        <Routes>
            <Route path={Paths.home} element={<LandingPage />} />
            <Route element={<GuestRoute />}>
                <Route path={Paths.login} element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path={Paths.quiz} element={<QuizPage />} />
                <Route path={Paths.stats} element={<StatsPage />} />
                <Route element={<AdminRoute />}>
                    <Route path={Paths.adminUsers} element={<AdminUsersPage />} />
                    <Route path={Paths.adminWords} element={<AdminWordsPage />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
