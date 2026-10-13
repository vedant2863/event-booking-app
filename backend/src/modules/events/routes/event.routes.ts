import express from 'express';

import { authenticate, authorize } from '../../../shared/middleware/auth.middleware';
import { UserRole } from '../../../shared/types';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const eventController = controller.eventController;

router.route('/')
  .get((req, res, next) => eventController.getEvents(req, res, next))
  .post(authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
    eventController.createEvent(req, res, next)
  );

router.route('/my')
  .get(authenticate, (req, res, next) => eventController.getMyEvents(req, res, next));

router.route('/my-events')
  .get(authenticate, (req, res, next) => eventController.getMyEvents(req, res, next));

router.route('/:id')
  .get((req, res, next) => eventController.getEvent(req, res, next))
  .put(authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
    eventController.updateEvent(req, res, next)
  )
  .delete(authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
    eventController.deleteEvent(req, res, next)
  );

router.route('/:id/seats')
  .get((req, res, next) => eventController.getEventWithSeats(req, res, next));

router.route('/:id/publish')
  .patch(authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
    eventController.publishEvent(req, res, next)
  );

router.route('/:id/cancel')
  .patch(authenticate, authorize(UserRole.ORGANIZER, UserRole.ADMIN), (req, res, next) =>
    eventController.cancelEvent(req, res, next)
  );

export default router;
