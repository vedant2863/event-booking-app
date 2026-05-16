import { Router, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { AuthenticatedRequest, UserRole } from '../../shared/types';
import { sendSuccess } from '../../shared/utils/response';
import { User } from '../users/user.model';
import { Event } from '../events/event.model';
import { Booking } from '../bookings/booking.model';
import { Payment } from '../payments/payment.model';

const router = Router();
router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/stats', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalEvents, totalBookings, revenueResult, recentBookings] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments({ isPublished: true }),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Booking.find()
        .populate('userId', 'username email')
        .populate('eventId', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    sendSuccess(res, { totalUsers, totalEvents, totalBookings, totalRevenue, recentBookings }, 'Stats fetched');
  } catch (err) { next(err); }
});

router.get('/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    sendSuccess(res, users, 'Users fetched', 200, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.patch('/users/:id/role', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    sendSuccess(res, user, 'Role updated');
  } catch (err) { next(err); }
});

router.get('/events', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'username email')
      .sort({ createdAt: -1 })
      .limit(50);
    sendSuccess(res, events, 'All events fetched');
  } catch (err) { next(err); }
});

router.get('/bookings', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate('userId', 'username email')
        .populate('eventId', 'title date')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(),
    ]);
    sendSuccess(res, bookings, 'Bookings fetched', 200, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

export default router;
