import { Prisma } from '@prisma/client';

import { db } from '../../../shared/database/prisma';
import { AllBookingPayload, CreateBookingData, UserBookingPayload } from '../types/booking.types';

export class BookingRepository {
  async create(data: CreateBookingData) {
    return db.booking.create({
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
    return db.booking.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
            banner: true,
            organizerId: true,
          },
        },
        user: {
          select: { id: true, username: true, email: true },
        },
        seats: true,
      },
    });
  }

  async updateById(id: string, update: Prisma.BookingUpdateInput) {
    return db.booking.update({
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
      db.booking.findMany({
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
      db.booking.count({ where: { userId } }),
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
      db.booking.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, email: true } },
          event: { select: { id: true, title: true, date: true } },
        },
      }),
      db.booking.count(),
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
    return db.booking.count();
  }

  async getTotalRevenue() {
    const result = await db.booking.aggregate({
      where: { paymentStatus: 'completed' },
      _sum: { totalAmount: true },
    });
    return result._sum.totalAmount || 0;
  }
}

export const bookingRepository = new BookingRepository();
