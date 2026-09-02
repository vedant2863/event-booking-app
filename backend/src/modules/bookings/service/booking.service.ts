import { Seat } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../shared/database/prisma';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../shared/errors/AppError';
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
    const event = await prisma.event.findUnique({ where: { id: dto.eventId } });
    if (!event) throw new NotFoundError('Event');
    if (event.isCancelled) throw new ValidationError('Event is cancelled');
    if (event.date < new Date()) throw new ValidationError('Event has already passed');

    const seats: Seat[] = await prisma.seat.findMany({
      where: {
        id: { in: dto.seatIds },
        eventId: dto.eventId,
      },
    });
    if (seats.length !== dto.seatIds.length) throw new NotFoundError('One or more seats');

    await this.seatService.lockSeats(dto.seatIds, dto.eventId, userId);

    const totalAmount = seats.reduce((sum: number, s: Seat) => sum + s.price, 0);
    const seatDetails = seats.map((s: Seat) => ({
      seatNumber: s.seatNumber,
      section: s.section,
      row: s.row,
      price: s.price,
    }));

    const booking = await this.bookingRepository.create({
      userId,
      eventId: dto.eventId,
      seats: dto.seatIds,
      seatDetails,
      totalAmount,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      bookingReference: `EVB-${uuidv4().split('-')[0].toUpperCase()}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const io = getSocketServer();
    if (io) {
      dto.seatIds.forEach((seatId: string) => {
        io.to(`event:${dto.eventId}`).emit('seat:locked', { seatId, eventId: dto.eventId });
      });
    }

    return {
      ...booking,
      _id: booking.id,
    };
  }

  async confirmPayment(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId !== userId) throw new ForbiddenError();
    if (booking.bookingStatus !== 'pending') throw new ValidationError('Booking is not pending');
    if (booking.expiresAt && booking.expiresAt < new Date())
      throw new ValidationError('Booking has expired');

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        expiresAt: null,
      },
    });

    const seatIds = booking.seats.map((s: Seat) => s.id);
    await this.seatService.confirmSeats(seatIds, booking.eventId, userId, bookingId);

    await prisma.event.update({
      where: { id: booking.eventId },
      data: {
        availableSeats: { decrement: seatIds.length },
      },
    });

    const io = getSocketServer();
    if (io) {
      seatIds.forEach((seatId: string) => {
        io.to(`event:${booking.eventId}`).emit('seat:booked', {
          seatId,
          eventId: booking.eventId,
        });
      });
      io.to(`user:${userId}`).emit('booking:confirmed', {
        bookingId,
        reference: booking.bookingReference,
      });
    }

    await this.notificationService.sendBookingConfirmation(bookingId, userId);

    return {
      ...updatedBooking,
      _id: updatedBooking.id,
    };
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId !== userId) throw new ForbiddenError();
    if (booking.bookingStatus === 'cancelled') throw new ValidationError('Already cancelled');

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: 'cancelled',
        paymentStatus: booking.paymentStatus === 'completed' ? 'refunded' : 'failed',
        cancelledAt: new Date(),
      },
    });

    const seatIds = booking.seats.map((s: Seat) => s.id);
    await this.seatService.releaseSeats(seatIds, booking.eventId);

    await prisma.event.update({
      where: { id: booking.eventId },
      data: {
        availableSeats: { increment: seatIds.length },
      },
    });

    const io = getSocketServer();
    if (io) {
      seatIds.forEach((seatId: string) => {
        io.to(`event:${booking.eventId}`).emit('seat:released', {
          seatId,
          eventId: booking.eventId,
        });
      });
    }

    return {
      ...updatedBooking,
      _id: updatedBooking.id,
    };
  }

  async getUserBookings(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const { bookings, total } = await this.bookingRepository.findByUser(userId, skip, limit);

    return { bookings, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
            banner: true,
            organizerId: true,
          },
        },
        user: {
          select: { id: true, username: true, email: true },
        },
        seats: true,
      },
    });
    if (!booking) throw new NotFoundError('Booking');
    if (booking.userId !== userId) throw new ForbiddenError();

    return {
      ...booking,
      _id: booking.id,
      eventId: booking.event,
      userId: booking.user,
    };
  }
}
