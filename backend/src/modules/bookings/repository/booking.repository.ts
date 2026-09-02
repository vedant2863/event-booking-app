import { Prisma } from '@prisma/client';

import { prisma } from '../../../shared/database/prisma';

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

type UserBookingPayload = Prisma.BookingGetPayload<{
  include: {
    event: {
      select: { id: true; title: true; date: true; venue: true; banner: true };
    };
  };
}>;

type AllBookingPayload = Prisma.BookingGetPayload<{
  include: {
    user: { select: { id: true; username: true; email: true } };
    event: { select: { id: true; title: true; date: true } };
  };
}>;

export class BookingRepository {
  async create(data: CreateBookingData) {
    return prisma.booking.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        seatDetails: data.seatDetails,
        totalAmount: data.totalAmount,
        bookingStatus: data.bookingStatus || 'pending',
        paymentStatus: data.paymentStatus || 'pending',
        bookingReference: data.bookingReference,
        expiresAt: data.expiresAt,
        seats: {
          connect: data.seats?.map((id: string) => ({ id })),
        },
      },
      include: {
        event: {
          select: { id: true, title: true, date: true, venue: true, banner: true },
        },
        user: {
          select: { id: true, username: true, email: true },
        },
        seats: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        event: {
          select: { id: true, title: true, date: true, venue: true, banner: true },
        },
        user: {
          select: { id: true, username: true, email: true },
        },
        seats: true,
      },
    });
  }

  async updateById(id: string, update: Prisma.BookingUpdateInput) {
    return prisma.booking.update({
      where: { id },
      data: update,
      include: {
        event: true,
        user: true,
        seats: true,
      },
    });
  }

  async findByUser(userId: string, skip: number, limit: number) {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: { id: true, title: true, date: true, venue: true, banner: true },
          },
        },
      }),
      prisma.booking.count({ where: { userId } }),
    ]);

    const formatted = bookings.map((b: UserBookingPayload) => ({
      ...b,
      _id: b.id,
      eventId: b.event,
    }));

    return { bookings: formatted, total };
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, email: true } },
          event: { select: { id: true, title: true, date: true } },
        },
      }),
      prisma.booking.count(),
    ]);

    const formatted = bookings.map((b: AllBookingPayload) => ({
      ...b,
      _id: b.id,
      userId: b.user,
      eventId: b.event,
    }));

    return { bookings: formatted, total };
  }

  async count() {
    return prisma.booking.count();
  }

  async getTotalRevenue() {
    const result = await prisma.booking.aggregate({
      where: { paymentStatus: 'completed' },
      _sum: { totalAmount: true },
    });
    return result._sum.totalAmount || 0;
  }
}

export const bookingRepository = new BookingRepository();
