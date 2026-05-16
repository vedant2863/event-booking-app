import { Response, NextFunction } from 'express';
import { Router } from 'express';
import { bookingService } from './booking.service';
import { AuthenticatedRequest } from '../../shared/types';
import { sendSuccess } from '../../shared/utils/response';
import { authenticate } from '../../shared/middleware/auth.middleware';

class BookingController {
  async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.createBooking(req.body, req.user!.userId);
      sendSuccess(res, booking, 'Booking created - proceed to payment', 201);
    } catch (err) { next(err); }
  }

  async confirmPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.confirmPayment(req.params.id, req.user!.userId);
      sendSuccess(res, booking, 'Payment confirmed - booking complete');
    } catch (err) { next(err); }
  }

  async cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.user!.userId);
      sendSuccess(res, booking, 'Booking cancelled');
    } catch (err) { next(err); }
  }

  async getUserBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query as any;
      const result = await bookingService.getUserBookings(req.user!.userId, +page || 1, +limit || 10);
      sendSuccess(res, result.bookings, 'Bookings fetched', 200, result.pagination);
    } catch (err) { next(err); }
  }

  async getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.getBookingById(req.params.id, req.user!.userId);
      sendSuccess(res, booking, 'Booking fetched');
    } catch (err) { next(err); }
  }
}

const bookingController = new BookingController();
const router = Router();

router.use(authenticate);
router.post('/', bookingController.createBooking.bind(bookingController));
router.get('/', bookingController.getUserBookings.bind(bookingController));
router.get('/:id', bookingController.getBooking.bind(bookingController));
router.post('/:id/confirm-payment', bookingController.confirmPayment.bind(bookingController));
router.delete('/:id', bookingController.cancelBooking.bind(bookingController));

export default router;
