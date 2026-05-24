import type { NotificationService } from '../service/notification.service';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  async sendBookingConfirmation(bookingId: string, userId: string) {
    return this.notificationService.sendBookingConfirmation(bookingId, userId);
  }

  async sendBookingCancellation(bookingId: string, userId: string) {
    return this.notificationService.sendBookingCancellation(bookingId, userId);
  }
}
