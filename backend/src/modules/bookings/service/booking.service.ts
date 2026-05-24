import mongoose from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

import { ForbiddenError, NotFoundError, ValidationError } from '../../../shared/errors/AppError';
import { Booking } from '../../../shared/models/booking.model';
import { Event } from '../../../shared/models/event.model';
import { ISeat, Seat } from '../../../shared/models/seat.model';
import { BookingStatus, PaymentStatus } from '../../../shared/types';
import { getSocketServer } from '../../../shared/websocket/socket';
import { notificationService } from '../../notifications/service/notification.service';
import { SeatRepository } from '../../seats/repository/seat.repository';
import { SeatService } from '../../seats/service/seat.service';
import { BookingRepository } from '../repository/booking.repository';

export interface CreateBookingDto {
  eventId: string;
  seatIds: string[];
}

export class BookingService {
  private seatService: SeatService;
  private notificationService: typeof notificationService;

  constructor(
    private readonly bookingRepository: BookingRepository,
    seatSvc?: SeatService,
    notifSvc?: typeof notificationService
  ) {
    this.seatService = seatSvc || new SeatService(new SeatRepository());
    this.notificationService = notifSvc || notificationService;
  }

  async createBooking(dto: CreateBookingDto, userId: string) {
    const event = await Event.findById(dto.eventId);
    if (!event) throw new NotFoundError('Event');
    if (event.isCancelled) throw new ValidationError('Event is cancelled');
    if (event.date < new Date()) throw new ValidationError('Event has already passed');

    const seats = (await Seat.find({
      _id: { $in: dto.seatIds },
      eventId: dto.eventId,
    }).exec()) as ISeat[];
    if (seats.length !== dto.seatIds.length) throw new NotFoundError('One or more seats');

    await this.seatService.lockSeats(dto.seatIds, dto.eventId, userId);

    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);
    const seatDetails = seats.map((s) => ({
      seatNumber: s.seatNumber,
      section: s.section,
      row: s.row,
      price: s.price,
    }));

    const booking = await this.bookingRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      eventId: new mongoose.Types.ObjectId(dto.eventId),
      seats: dto.seatIds.map((id) => new mongoose.Types.ObjectId(id)),
      seatDetails,
      totalAmount,
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      bookingReference: `EVB-${uuidv4().split('-')[0].toUpperCase()}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const io = getSocketServer();
    if (io) {
      dto.seatIds.forEach((seatId) => {
        io.to(`event:${dto.eventId}`).emit('seat:locked', { seatId, eventId: dto.eventId });
      });
    }

    return booking;
  }

  async confirmPayment(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId.toString() !== userId) throw new ForbiddenError();
    if (booking.bookingStatus !== BookingStatus.PENDING)
      throw new ValidationError('Booking is not pending');
    if (booking.expiresAt && booking.expiresAt < new Date())
      throw new ValidationError('Booking has expired');

    booking.paymentStatus = PaymentStatus.COMPLETED;
    booking.bookingStatus = BookingStatus.CONFIRMED;
    booking.expiresAt = undefined;
    await booking.save();

    await this.seatService.confirmSeats(
      booking.seats.map((s) => s.toString()),
      booking.eventId.toString(),
      userId,
      bookingId
    );

    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { availableSeats: -booking.seats.length },
    });

    const io = getSocketServer();
    if (io) {
      const eventIdStr = booking.eventId.toString();
      booking.seats.forEach((seatId) => {
        io.to(`event:${eventIdStr}`).emit('seat:booked', {
          seatId: seatId.toString(),
          eventId: eventIdStr,
        });
      });
      io.to(`user:${userId}`).emit('booking:confirmed', {
        bookingId,
        reference: booking.bookingReference,
      });
    }

    await this.notificationService.sendBookingConfirmation(bookingId, userId);

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId.toString() !== userId) throw new ForbiddenError();
    if (booking.bookingStatus === BookingStatus.CANCELLED)
      throw new ValidationError('Already cancelled');

    booking.bookingStatus = BookingStatus.CANCELLED;
    booking.paymentStatus =
      booking.paymentStatus === PaymentStatus.COMPLETED
        ? PaymentStatus.REFUNDED
        : PaymentStatus.FAILED;
    booking.cancelledAt = new Date();
    await booking.save();

    await this.seatService.releaseSeats(
      booking.seats.map((s) => s.toString()),
      booking.eventId.toString()
    );

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
    const { bookings, total } = await this.bookingRepository.findByUser(userId, skip, limit);

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
