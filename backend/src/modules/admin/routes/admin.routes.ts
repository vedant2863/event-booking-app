import express from 'express';

import { authenticate, authorize } from '../../../shared/middleware/auth.middleware';
import { UserRole } from '../../../shared/types';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const adminController = controller.adminController;

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/stats', (req, res, next) => adminController.getStats(req, res, next));
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));
router.patch('/users/:id/role', (req, res, next) => adminController.updateUserRole(req, res, next));
router.get('/events', (req, res, next) => adminController.getEvents(req, res, next));
router.get('/bookings', (req, res, next) => adminController.getBookings(req, res, next));

export default router;
