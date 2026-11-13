import type { ReactNode } from 'react';
import type { LoginInput, RegisterInput, User } from './auth';

export interface AuthContextValue {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
}

export interface AuthProviderProps {
    children: ReactNode;
}
