import { useEffect, type JSX } from 'react';
import { NavigationType, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { AdminUsersPage, AdminWordsPage, LandingPage, LoginPage, NotFoundPage, QuizPage, StatsPage } from '@/pages';
import { AdminRoute } from './AdminRoute';
import { GuestRoute } from './GuestRoute';
import { Paths } from './paths';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = (): JSX.Element => {
    const { key } = useLocation();
    const navigationType: NavigationType = useNavigationType();

    useEffect((): void => {
        if (navigationType !== NavigationType.Pop) window.scrollTo(0, 0);
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
