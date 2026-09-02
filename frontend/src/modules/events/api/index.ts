import api from '../../shared/api/client';
import { ApiResponse, CreateEventPayload, Event, SeatLayout } from '../../shared/types';

// Events
export const eventsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<Event[]>>('/events', { params }),
  getById: (id: string) => api.get<ApiResponse<Event>>(`/events/${id}`),
  getWithSeats: (id: string) =>
    api.get<ApiResponse<{ event: Event; layout: SeatLayout }>>(`/events/${id}/seats`),
  create: (data: CreateEventPayload) => api.post<ApiResponse<Event>>('/events', data),
  update: (id: string, data: CreateEventPayload) =>
    api.put<ApiResponse<Event>>(`/events/${id}`, data),
  publish: (id: string) => api.patch<ApiResponse<Event>>(`/events/${id}/publish`),
  cancel: (id: string) => api.patch<ApiResponse<Event>>(`/events/${id}/cancel`),
  delete: (id: string) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get<ApiResponse<Event[]>>('/events/my'),
};
