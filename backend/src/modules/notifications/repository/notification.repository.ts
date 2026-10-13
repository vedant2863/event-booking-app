import { db } from '../../../shared/database/prisma';

export class NotificationRepository {
  async getBookingWithEvent(bookingId: string) {
    return db.booking.findUnique({
      where: { id: bookingId },
      include: { event: true },
    });
  }

  async getUserById(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
    });
  }

  async getBookingById(bookingId: string) {
    return db.booking.findUnique({
      where: { id: bookingId },
    });
  }
}

export const notificationRepository = new NotificationRepository();
