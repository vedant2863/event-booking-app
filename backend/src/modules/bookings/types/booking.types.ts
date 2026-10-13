import { Prisma } from '@prisma/client';

export interface CreateBookingDto {
  eventId: string;
  seatIds: string[];
}

export interface CreateBookingData {
  userId: string;
  eventId: string;
  seatDetails: Prisma.InputJsonValue;
  totalAmount: number;
  bookingStatus?: string;
  paymentStatus?: string;
  bookingReference: string;
  expiresAt?: Date | null;
  seats?: string[];
}

export type UserBookingPayload = Prisma.BookingGetPayload<{
  include: {
    event: {
      select: { id: true; title: true; date: true; venue: true; banner: true };
    };
  };
}>;

export type AllBookingPayload = Prisma.BookingGetPayload<{
  include: {
    user: { select: { id: true; username: true; email: true } };
    event: { select: { id: true; title: true; date: true } };
  };
}>;
