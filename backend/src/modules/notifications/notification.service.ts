import nodemailer from 'nodemailer';
import { config } from '../../config/env';
import { logger } from '../../shared/utils/logger';
import { Booking } from '../bookings/booking.model';
import { User } from '../users/user.model';
import { Event } from '../events/event.model';

class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!config.smtp.user) {
        logger.info(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
      }
      await this.transporter.sendMail({ from: config.smtp.from, to, subject, html });
      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      logger.error('Email send failed:', err);
    }
  }

  async sendBookingConfirmation(bookingId: string, userId: string) {
    const [booking, user] = await Promise.all([
      Booking.findById(bookingId).populate<{ eventId: any }>('eventId'),
      User.findById(userId),
    ]);

    if (!booking || !user) return;

    const event = booking.eventId;
    const seatsText = booking.seatDetails
      .map((s) => `${s.section} - Row ${s.row} - Seat ${s.seatNumber}`)
      .join('<br>');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#6366f1">🎉 Booking Confirmed!</h1>
        <p>Hi <strong>${user.username}</strong>,</p>
        <p>Your booking for <strong>${event?.title || 'the event'}</strong> is confirmed.</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0">
          <p><strong>Booking Ref:</strong> ${booking.bookingReference}</p>
          <p><strong>Seats:</strong><br>${seatsText}</p>
          <p><strong>Total:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Date:</strong> ${event?.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
          <p><strong>Venue:</strong> ${event?.venue?.name}, ${event?.venue?.city}</p>
        </div>
        <p>See you there! 🎊</p>
      </div>
    `;

    await this.sendEmail(user.email, `Booking Confirmed - ${booking.bookingReference}`, html);
  }

  async sendBookingCancellation(bookingId: string, userId: string) {
    const [booking, user] = await Promise.all([
      Booking.findById(bookingId).populate<{ eventId: any }>('eventId'),
      User.findById(userId),
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
