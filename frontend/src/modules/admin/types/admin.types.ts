import { Booking } from '../../bookings/types/booking.types';

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
}
