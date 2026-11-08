import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { authApi } from '@/services/auth.service';
import type { LoginInput, RegisterInput, User } from '@/types/auth';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        authApi
            .profile()
            .then((r) => active && setUser(r.user))
            .catch(() => active && setUser(null))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, []);

    const login = useCallback(async (input: LoginInput) => {
        setUser((await authApi.login(input)).user);
    }, []);

    const register = useCallback(async (input: RegisterInput) => {
        setUser((await authApi.register(input)).user);
    }, []);

    const logout = useCallback(async () => {
        await authApi.logout().catch(() => undefined);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, loading, isAdmin: user?.role === 'admin', login, register, logout }),
        [user, loading, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');

    return ctx;
};
