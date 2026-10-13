import express from 'express';

import { authenticate, authorize } from '../../../shared/middleware/auth.middleware';
import { UserRole } from '../../../shared/types';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const adminController = controller.adminController;

/**
 * Cloud Seed Trigger (Can be called via Browser / Postman / cURL on Vercel)
 * Usage: GET or POST /api/admin/seed?secret=admin_seed_secret
 */
router.route('/seed')
  .all((req, res) => adminController.seed(req, res));

// Protected Admin routes
router.use(authenticate, authorize(UserRole.ADMIN));

router.route('/stats')
  .get((req, res, next) => adminController.getStats(req, res, next));

router.route('/users')
  .get((req, res, next) => adminController.getUsers(req, res, next));

router.route('/users/:id/role')
  .patch((req, res, next) => adminController.updateUserRole(req, res, next));

router.route('/events')
  .get((req, res, next) => adminController.getEvents(req, res, next));

router.route('/bookings')
  .get((req, res, next) => adminController.getBookings(req, res, next));

export default router;
