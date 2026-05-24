import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../../../shared/types';
import ResponseFormatter from '../../../shared/utils/response';
import { BookingService } from '../service/booking.service';

export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.createBooking(req.body, req.user!.userId);
      ResponseFormatter.success(res, booking, 'Booking created - proceed to payment', 201);
    } catch (err) {
      next(err);
    }
  }

  async confirmPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.confirmPayment(req.params.id, req.user!.userId);
      ResponseFormatter.success(res, booking, 'Payment confirmed - booking complete');
    } catch (err) {
      next(err);
    }
  }

  async cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.cancelBooking(req.params.id, req.user!.userId);
      ResponseFormatter.success(res, booking, 'Booking cancelled');
    } catch (err) {
      next(err);
    }
  }

  async getUserBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query as { page?: string; limit?: string };
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const result = await this.bookingService.getUserBookings(req.user!.userId, page, limit);
      ResponseFormatter.success(res, result.bookings, 'Bookings fetched', 200, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  async getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.getBookingById(req.params.id, req.user!.userId);
      ResponseFormatter.success(res, booking, 'Booking fetched');
    } catch (err) {
      next(err);
    }
  }
}
