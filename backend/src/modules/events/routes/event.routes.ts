import express from 'express';

import { authenticate, authorize } from '../../../shared/middleware/auth.middleware';
import { UserRole } from '../../../shared/types';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const eventController = controller.eventController;

router.get('/', (req, res, next) => eventController.getEvents(req, res, next));
router.get('/my', authenticate, (req, res, next) => eventController.getMyEvents(req, res, next));
router.get('/:id', (req, res, next) => eventController.getEvent(req, res, next));
router.get('/:id/seats', (req, res, next) => eventController.getEventWithSeats(req, res, next));

router.post('/', authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
  eventController.createEvent(req, res, next)
);
router.put('/:id', authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
  eventController.updateEvent(req, res, next)
);
router.patch(
  '/:id/publish',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  (req, res, next) => eventController.publishEvent(req, res, next)
);
router.patch(
  '/:id/cancel',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  (req, res, next) => eventController.cancelEvent(req, res, next)
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  (req, res, next) => eventController.deleteEvent(req, res, next)
);

export default router;
