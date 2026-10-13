import api from '../../../shared/api/client';
import { ApiResponse } from '../../../shared/types';
import { AuthResponseData, LoginPayload, RegisterPayload, User } from '../types/auth.types';

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<ApiResponse<AuthResponseData>>('/auth/register', data),
  login: (data: LoginPayload) =>
    api.post<ApiResponse<AuthResponseData>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
};
