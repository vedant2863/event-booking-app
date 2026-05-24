import api from './client';
import { ApiResponse, User, Booking } from '../types';

// Auth
export const authApi = {
  register: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Bookings
export const bookingsApi = {
  create: (data: { eventId: string; seatIds: string[] }) =>
    api.post<ApiResponse<Booking>>('/bookings', data),
  getAll: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<Booking[]>>('/bookings', { params }),
  getById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  confirmPayment: (id: string) => api.post<ApiResponse<Booking>>(`/bookings/${id}/confirm-payment`),
  cancel: (id: string) => api.delete<ApiResponse<Booking>>(`/bookings/${id}`),
};
