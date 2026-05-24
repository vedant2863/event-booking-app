import { Booking, IBooking } from '../../../shared/models/booking.model';
import { Event, IEvent } from '../../../shared/models/event.model';
import { IUser, User } from '../../../shared/models/user.model';

import { BaseRepository } from './BaseRepository';

export class AdminRepository extends BaseRepository {
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    recentBookings: IBooking[];
  }> {
    const [totalUsers, totalEvents, totalBookings, revenueResult, recentBookings] =
      await Promise.all([
        User.countDocuments(),
        Event.countDocuments({ isPublished: true }),
        Booking.countDocuments({ bookingStatus: 'confirmed' }),
        Booking.aggregate([
          { $match: { paymentStatus: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Booking.find()
          .populate('userId', 'username email')
          .populate('eventId', 'title')
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    return {
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue: revenueResult[0]?.total || 0,
      recentBookings,
    };
  }

  async findUsers(
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async updateUserRole(userId: string, role: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async findEvents(): Promise<IEvent[]> {
    return Event.find().populate('organizer', 'username email').sort({ createdAt: -1 });
  }

  async findBookings(
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate('userId', 'username email')
        .populate('eventId', 'title date')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(),
    ]);

    return {
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}

export const adminRepository = new AdminRepository();
