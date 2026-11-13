import type { Role } from '@/enums';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
}

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface UserResponse {
    user: User;
}

export interface AuthApi {
    profile: () => Promise<UserResponse>;
    login: (input: LoginInput) => Promise<UserResponse>;
    register: (input: RegisterInput) => Promise<UserResponse>;
    logout: () => Promise<void>;
}
