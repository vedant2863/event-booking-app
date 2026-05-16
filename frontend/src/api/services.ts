import api from './client';
import { ApiResponse, Event, User, Booking, AdminStats } from '../types';

// Auth
export const authApi = {
  register: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Events
export const eventsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<ApiResponse<Event[]>>('/events', { params }),
  getById: (id: string) => api.get<ApiResponse<Event>>(`/events/${id}`),
  getWithSeats: (id: string) => api.get<ApiResponse<{ event: Event; layout: any }>>(`/events/${id}/seats`),
  create: (data: any) => api.post<ApiResponse<Event>>('/events', data),
  update: (id: string, data: any) => api.put<ApiResponse<Event>>(`/events/${id}`, data),
  publish: (id: string) => api.patch<ApiResponse<Event>>(`/events/${id}/publish`),
  cancel: (id: string) => api.patch<ApiResponse<Event>>(`/events/${id}/cancel`),
  delete: (id: string) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get<ApiResponse<Event[]>>('/events/my'),
};

// Bookings
export const bookingsApi = {
  create: (data: { eventId: string; seatIds: string[] }) =>
    api.post<ApiResponse<Booking>>('/bookings', data),
  getAll: (params?: Record<string, any>) =>
    api.get<ApiResponse<Booking[]>>('/bookings', { params }),
  getById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  confirmPayment: (id: string) => api.post<ApiResponse<Booking>>(`/bookings/${id}/confirm-payment`),
  cancel: (id: string) => api.delete<ApiResponse<Booking>>(`/bookings/${id}`),
};

// Admin
export const adminApi = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
  getUsers: (params?: Record<string, any>) => api.get<ApiResponse<User[]>>('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
  getAllEvents: () => api.get<ApiResponse<Event[]>>('/admin/events'),
  getAllBookings: (params?: Record<string, any>) =>
    api.get<ApiResponse<Booking[]>>('/admin/bookings', { params }),
};
