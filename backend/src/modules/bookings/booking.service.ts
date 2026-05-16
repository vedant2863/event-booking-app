import { v4 as uuidv4 } from 'uuid';
import { Booking } from './booking.model';
import { Event } from '../events/event.model';
import { Seat } from '../seats/seat.model';
import { seatService } from '../seats/seat.service';
import { notificationService } from '../notifications/notification.service';
import { BookingStatus, PaymentStatus } from '../../shared/types';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors/AppError';
import { getSocketServer } from '../../websocket/socket';

export interface CreateBookingDto {
  eventId: string;
  seatIds: string[];
}

export class BookingService {
  async createBooking(dto: CreateBookingDto, userId: string) {
    const event = await Event.findById(dto.eventId);
    if (!event) throw new NotFoundError('Event');
    if (event.isCancelled) throw new ValidationError('Event is cancelled');
    if (event.date < new Date()) throw new ValidationError('Event has already passed');

    const seats = await Seat.find({ _id: { $in: dto.seatIds }, eventId: dto.eventId });
    if (seats.length !== dto.seatIds.length) throw new NotFoundError('One or more seats');

    // Lock seats in Redis
    await seatService.lockSeats(dto.seatIds, dto.eventId, userId);

    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);
    const seatDetails = seats.map((s) => ({
      seatNumber: s.seatNumber,
      section: s.section,
      row: s.row,
      price: s.price,
    }));

    const booking = await Booking.create({
      userId,
      eventId: dto.eventId,
      seats: dto.seatIds,
      seatDetails,
      totalAmount,
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      bookingReference: `EVB-${uuidv4().split('-')[0].toUpperCase()}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min to pay
    });

    // Emit real-time seat lock events
    const io = getSocketServer();
    if (io) {
      dto.seatIds.forEach((seatId) => {
        io.to(`event:${dto.eventId}`).emit('seat:locked', { seatId, eventId: dto.eventId });
      });
    }

    return booking;
  }

  async confirmPayment(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId.toString() !== userId) throw new ForbiddenError();
    if (booking.bookingStatus !== BookingStatus.PENDING) throw new ValidationError('Booking is not pending');
    if (booking.expiresAt && booking.expiresAt < new Date()) throw new ValidationError('Booking has expired');

    // Simulate payment success
    booking.paymentStatus = PaymentStatus.COMPLETED;
    booking.bookingStatus = BookingStatus.CONFIRMED;
    booking.expiresAt = undefined;
    await booking.save();

    // Confirm seats in DB
    await seatService.confirmSeats(
      booking.seats.map((s) => s.toString()),
      booking.eventId.toString(),
      userId,
      bookingId
    );

    // Decrement available seats
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { availableSeats: -booking.seats.length },
    });

    // Emit booking confirmed to room
    const io = getSocketServer();
    if (io) {
      const eventIdStr = booking.eventId.toString();
      booking.seats.forEach((seatId) => {
        io.to(`event:${eventIdStr}`).emit('seat:booked', {
          seatId: seatId.toString(),
          eventId: eventIdStr,
        });
      });
      io.to(`user:${userId}`).emit('booking:confirmed', { bookingId, reference: booking.bookingReference });
    }

    // Send notification
    await notificationService.sendBookingConfirmation(bookingId, userId);

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId.toString() !== userId) throw new ForbiddenError();
    if (booking.bookingStatus === BookingStatus.CANCELLED) throw new ValidationError('Already cancelled');

    booking.bookingStatus = BookingStatus.CANCELLED;
    booking.paymentStatus = booking.paymentStatus === PaymentStatus.COMPLETED
      ? PaymentStatus.REFUNDED
      : PaymentStatus.FAILED;
    booking.cancelledAt = new Date();
    await booking.save();

    // Release seats
    await seatService.releaseSeats(
      booking.seats.map((s) => s.toString()),
      booking.eventId.toString()
    );

    // Restore available seats count
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { availableSeats: booking.seats.length },
    });

    const io = getSocketServer();
    if (io) {
      booking.seats.forEach((seatId) => {
        io.to(`event:${booking.eventId.toString()}`).emit('seat:released', {
          seatId: seatId.toString(),
          eventId: booking.eventId.toString(),
        });
      });
    }

    return booking;
  }

  async getUserBookings(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find({ userId })
        .populate('eventId', 'title date venue banner')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments({ userId }),
    ]);
    return { bookings, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId)
      .populate('eventId', 'title date venue banner organizer')
      .populate('userId', 'username email');
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId._id.toString() !== userId) throw new ForbiddenError();
    return booking;
  }
}

export const bookingService = new BookingService();
