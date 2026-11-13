import type { AuthApi, LoginInput, RegisterInput, UserResponse } from '@/types';
import { http } from './http';

export const authApi: AuthApi = {
    profile: (): Promise<UserResponse> => http.get<UserResponse>('/auth/profile'),
    login: (input: LoginInput): Promise<UserResponse> => http.post<UserResponse>('/auth/login', input),
    register: (input: RegisterInput): Promise<UserResponse> => http.post<UserResponse>('/auth/register', input),
    logout: (): Promise<void> => http.post<void>('/auth/logout'),
};
