import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Context, type JSX } from 'react';
import { Role } from '@/enums';
import { authApi } from '@/services';
import type { AuthContextValue, AuthProviderProps, LoginInput, RegisterInput, User } from '@/types';

const AuthContext: Context<AuthContextValue | null> = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect((): (() => void) => {
        let active: boolean = true;

        authApi
            .profile()
            .then((r): void => {
                if (active) setUser(r.user);
            })
            .catch((): void => {
                if (active) setUser(null);
            })
            .finally((): void => {
                if (active) setLoading(false);
            });

        return (): void => {
            active = false;
        };
    }, []);

    const login = useCallback(async (input: LoginInput): Promise<void> => {
        setUser((await authApi.login(input)).user);
    }, []);

    const register = useCallback(async (input: RegisterInput): Promise<void> => {
        setUser((await authApi.register(input)).user);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        await authApi.logout().catch((): undefined => undefined);
        setUser(null);
    }, []);

    const value = useMemo(
        (): AuthContextValue => ({ user, loading, isAdmin: user?.role === Role.Admin, login, register, logout }),
        [user, loading, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const ctx: AuthContextValue | null = useContext(AuthContext);

    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');

    return ctx;
};
