import { Prisma } from '@prisma/client';

import { prisma } from '../../../shared/database/prisma';

type UserSelectResult = Prisma.UserGetPayload<{
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

type RecentBookingPayload = Prisma.BookingGetPayload<{
  include: {
    user: { select: { id: true; username: true; email: true } };
    event: { select: { id: true; title: true } };
  };
}>;

type AdminEventPayload = Prisma.EventGetPayload<{
  include: {
    organizer: { select: { id: true; username: true; email: true } };
  };
}>;

type AdminBookingPayload = Prisma.BookingGetPayload<{
  include: {
    user: { select: { id: true; username: true; email: true } };
    event: { select: { id: true; title: true; date: true } };
  };
}>;

export class AdminRepository {
  async getDashboardStats() {
    const [totalUsers, totalEvents, totalBookings, revenueResult, recentBookings] =
      await Promise.all([
        prisma.user.count(),
        prisma.event.count({ where: { isPublished: true } }),
        prisma.booking.count({ where: { bookingStatus: 'confirmed' } }),
        prisma.booking.aggregate({
          where: { paymentStatus: 'completed' },
          _sum: { totalAmount: true },
        }),
        prisma.booking.findMany({
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
      prisma.user.findMany({
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
      prisma.user.count(),
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
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async findEvents() {
    const events = await prisma.event.findMany({
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
