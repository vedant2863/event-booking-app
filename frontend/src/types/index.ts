export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  capacity: number;
}

export type EventCategory = 'music' | 'sports' | 'tech' | 'art' | 'food' | 'comedy' | 'theatre' | 'other';

export interface Event {
  _id: string;
  title: string;
  description: string;
  venue: Venue;
  category: EventCategory;
  date: string;
  endDate: string;
  organizer: { _id: string; username: string; email: string; profileImage?: string };
  banner?: string;
  tags: string[];
  isPublished: boolean;
  isCancelled: boolean;
  totalSeats: number;
  availableSeats: number;
  minPrice: number;
  maxPrice: number;
  createdAt: string;
}

export type SeatStatus = 'available' | 'locked' | 'booked';

export interface Seat {
  _id: string;
  eventId: string;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
  status: SeatStatus;
}

export interface SeatDetails {
  seatNumber: string;
  section: string;
  row: string;
  price: number;
}

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
}
