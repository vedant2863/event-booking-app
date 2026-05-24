import express from 'express';

import { authenticate } from '../../../shared/middleware/auth.middleware';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const bookingController = controller.bookingController;

router.use(authenticate);
router.post('/', (req, res, next) => bookingController.createBooking(req, res, next));
router.get('/', (req, res, next) => bookingController.getUserBookings(req, res, next));
router.get('/:id', (req, res, next) => bookingController.getBooking(req, res, next));
router.post('/:id/confirm-payment', (req, res, next) =>
  bookingController.confirmPayment(req, res, next)
);
router.delete('/:id', (req, res, next) => bookingController.cancelBooking(req, res, next));

export default router;
