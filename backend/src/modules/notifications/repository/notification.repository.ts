import { prisma } from '../../../shared/database/prisma';

export class NotificationRepository {
  async getBookingWithEvent(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true },
    });
  }

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getBookingById(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
    });
  }
}

export const notificationRepository = new NotificationRepository();
