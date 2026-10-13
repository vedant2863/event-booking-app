import { User } from '../../auth/types/auth.types';
import { Event } from '../../events/types/event.types';
import { SeatDetails } from '../../seats/types/seat.types';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Booking {
  _id: string;
  userId: string | User;
  eventId: string | Event;
  seats: string[];
  seatDetails: SeatDetails[];
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingReference: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  eventId: string;
  seatIds: string[];
}
