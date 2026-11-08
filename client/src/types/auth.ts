export type Role = 'user' | 'admin';

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
