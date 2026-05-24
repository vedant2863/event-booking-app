import api from '../../shared/api/client';
import { AdminStats, ApiResponse, Booking, User, Event } from '../../shared/types';

// Admin
export const adminApi = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
  getUsers: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<User[]>>('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
  getAllEvents: () => api.get<ApiResponse<Event[]>>('/admin/events'),
  getAllBookings: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<Booking[]>>('/admin/bookings', { params }),
};
