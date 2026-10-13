import express from 'express';

import { authenticate } from '../../../shared/middleware/auth.middleware';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const bookingController = controller.bookingController;

router.use(authenticate);

router.route('/')
  .post((req, res, next) => bookingController.createBooking(req, res, next))
  .get((req, res, next) => bookingController.getUserBookings(req, res, next));

router.route('/:id')
  .get((req, res, next) => bookingController.getBooking(req, res, next))
  .delete((req, res, next) => bookingController.cancelBooking(req, res, next));

router.route('/:id/confirm-payment')
  .post((req, res, next) => bookingController.confirmPayment(req, res, next));

export default router;
