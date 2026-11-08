import { http } from '@/services/http';
import type { LoginInput, RegisterInput, User } from '@/types/auth';

type UserResponse = { user: User };

export const authApi = {
    profile: () => http.get<UserResponse>('/auth/profile'),
    login: (input: LoginInput) => http.post<UserResponse>('/auth/login', input),
    register: (input: RegisterInput) => http.post<UserResponse>('/auth/register', input),
    logout: () => http.post<void>('/auth/logout'),
};
