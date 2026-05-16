import { Router } from 'express';
import { eventController } from './event.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/types';

const router = Router();

router.get('/', eventController.getEvents.bind(eventController));
router.get('/my', authenticate, eventController.getMyEvents.bind(eventController));
router.get('/:id', eventController.getEvent.bind(eventController));
router.get('/:id/seats', eventController.getEventWithSeats.bind(eventController));

router.post(
  '/',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  eventController.createEvent.bind(eventController)
);
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  eventController.updateEvent.bind(eventController)
);
router.patch(
  '/:id/publish',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  eventController.publishEvent.bind(eventController)
);
router.patch(
  '/:id/cancel',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  eventController.cancelEvent.bind(eventController)
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ORGANIZER, UserRole.ADMIN),
  eventController.deleteEvent.bind(eventController)
);

export default router;
