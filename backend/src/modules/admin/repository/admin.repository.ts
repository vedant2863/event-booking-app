import { Prisma } from '@prisma/client';

import { db } from '../../../shared/database/prisma';
import {
  AdminBookingPayload,
  AdminEventPayload,
  RecentBookingPayload,
  UserSelectResult,
} from '../types/admin.types';


export class AdminRepository {
  async getDashboardStats() {
    const [totalUsers, totalEvents, totalBookings, revenueResult, recentBookings] =
      await Promise.all([
        db.user.count(),
        db.event.count({ where: { isPublished: true } }),
        db.booking.count({ where: { bookingStatus: 'confirmed' } }),
        db.booking.aggregate({
          where: { paymentStatus: 'completed' },
          _sum: { totalAmount: true },
        }),
        db.booking.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, username: true, email: true } },
            event: { select: { id: true, title: true } },
          },
        }),
      ]);

    const formattedRecent = recentBookings.map((b: RecentBookingPayload) => ({
      ...b,
      _id: b.id,
      userId: b.user,
      eventId: b.event,
    }));

    return {
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      recentBookings: formattedRecent,
    };
  }

  async findUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profileImage: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.user.count(),
    ]);

    const formatted = users.map((u: UserSelectResult) => ({
      ...u,
      _id: u.id,
    }));

    return {
      users: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async updateUserRole(userId: string, role: string) {
    return db.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async findEvents() {
    const events = await db.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    return events.map((e: AdminEventPayload) => ({
      ...e,
      _id: e.id,
      organizer: e.organizer,
    }));
  }

  async findBookings(page: number, limit: number) {
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

    const formatted = bookings.map((b: AdminBookingPayload) => ({
      ...b,
      _id: b.id,
      userId: b.user,
      eventId: b.event,
    }));

    return {
      bookings: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}

export const adminRepository = new AdminRepository();
