import { prisma } from '../../../shared/database/prisma';
import { EmailProvider, SmtpEmailProvider } from '../../../shared/email/email.provider';
import { logger } from '../../../shared/utils/logger';

interface SeatDetailItem {
  section?: string;
  row?: string;
  seatNumber?: string;
}

interface VenueDetailItem {
  name?: string;
  city?: string;
}

export class NotificationService {
  constructor(private readonly emailProvider: EmailProvider = new SmtpEmailProvider()) {}

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.emailProvider.sendEmail(to, subject, html);
    } catch (err) {
      logger.error('Email send failed:', err);
    }
  }

  async sendBookingConfirmation(bookingId: string, userId: string) {
    const [booking, user] = await Promise.all([
      prisma.booking.findUnique({
        where: { id: bookingId },
        include: { event: true },
      }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!booking || !user) return;

    const event = booking.event;
    const rawSeats = Array.isArray(booking.seatDetails) ? booking.seatDetails : [];
    const seatDetails = rawSeats as unknown as SeatDetailItem[];
    const seatsText = seatDetails
      .map((s) => `${s.section || ''} - Row ${s.row || ''} - Seat ${s.seatNumber || ''}`)
      .join('<br>');

    const venue = event?.venue as unknown as VenueDetailItem | null;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#f84464">🎉 EventBook Booking Confirmed!</h1>
        <p>Hi <strong>${user.username}</strong>,</p>
        <p>Your booking for <strong>${event?.title || 'the event'}</strong> is confirmed.</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0">
          <p><strong>Booking Ref:</strong> ${booking.bookingReference}</p>
          <p><strong>Seats:</strong><br>${seatsText}</p>
          <p><strong>Total:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Date:</strong> ${event?.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
          <p><strong>Venue:</strong> ${venue?.name || ''}, ${venue?.city || ''}</p>
        </div>
        <p>Enjoy the show! 🍿</p>
      </div>
    `;

    await this.sendEmail(user.email, `Booking Confirmed - ${booking.bookingReference}`, html);
  }

  async sendBookingCancellation(bookingId: string, userId: string) {
    const [booking, user] = await Promise.all([
      prisma.booking.findUnique({ where: { id: bookingId } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!booking || !user) return;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#ef4444">Booking Cancelled</h1>
        <p>Hi <strong>${user.username}</strong>,</p>
        <p>Your booking <strong>${booking.bookingReference}</strong> has been cancelled.</p>
        ${booking.paymentStatus === 'refunded' ? '<p>A refund has been initiated.</p>' : ''}
      </div>
    `;

    await this.sendEmail(user.email, `Booking Cancelled - ${booking.bookingReference}`, html);
  }
}

export const notificationService = new NotificationService();
