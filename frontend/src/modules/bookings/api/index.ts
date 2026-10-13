import api from '../../../shared/api/client';
import { ApiResponse } from '../../../shared/types';
import { Booking, CreateBookingPayload } from '../types/booking.types';

export const bookingsApi = {
  create: (data: CreateBookingPayload) =>
    api.post<ApiResponse<Booking>>('/bookings', data),
  getAll: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<Booking[]>>('/bookings', { params }),
  getById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  confirmPayment: (id: string) =>
    api.post<ApiResponse<Booking>>(`/bookings/${id}/confirm-payment`),
  cancel: (id: string) => api.delete<ApiResponse<Booking>>(`/bookings/${id}`),
};
