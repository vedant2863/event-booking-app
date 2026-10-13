import { Prisma } from '@prisma/client';

export type UserSelectResult = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    email: true;
    role: true;
    profileImage: true;
    isVerified: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type RecentBookingPayload = Prisma.BookingGetPayload<{
  include: {
    user: { select: { id: true; username: true; email: true } };
    event: { select: { id: true; title: true } };
  };
}>;

export type AdminEventPayload = Prisma.EventGetPayload<{
  include: {
    organizer: { select: { id: true; username: true; email: true } };
  };
}>;

export type AdminBookingPayload = Prisma.BookingGetPayload<{
  include: {
    user: { select: { id: true; username: true; email: true } };
    event: { select: { id: true; title: true; date: true } };
  };
}>;

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: RecentBookingPayload[];
}
