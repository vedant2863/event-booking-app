import express from 'express';

import { seedDatabase } from '../../../scripts/seed';
import { config } from '../../../shared/config/env';
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
router.all('/seed', async (req, res) => {
  const providedSecret = req.query.secret || req.headers['x-admin-secret'];
  const isValidSecret =
    providedSecret === config.jwt.secret ||
    providedSecret === config.jwt.refreshSecret ||
    providedSecret === 'admin_seed_secret';

  if (!isValidSecret && req.headers.authorization) {
    // If auth token provided, verify if admin
    return authenticate(req, res, () => {
      authorize(UserRole.ADMIN)(req, res, async () => {
        try {
          const result = await seedDatabase();
          return res.status(200).json({ success: true, ...result });
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : 'Seeding failed';
          return res.status(500).json({ success: false, error: errorMsg });
        }
      });
    });
  }

  if (!isValidSecret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Provide valid ?secret=admin_seed_secret or x-admin-secret header.',
    });
  }

  try {
    const result = await seedDatabase();
    return res.status(200).json({
      success: true,
      eventsCount: result.eventsCount,
      totalSeats: result.totalSeats,
      message: result.message,
      credentials: {
        admin: 'admin@demo.com / password123',
        organizer: 'organizer@demo.com / password123',
        user: 'user@demo.com / password123',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Seeding failed';
    return res.status(500).json({ success: false, error: errorMsg });
  }
});

// Protected Admin routes
router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/stats', (req, res, next) => adminController.getStats(req, res, next));
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));
router.patch('/users/:id/role', (req, res, next) => adminController.updateUserRole(req, res, next));
router.get('/events', (req, res, next) => adminController.getEvents(req, res, next));
router.get('/bookings', (req, res, next) => adminController.getBookings(req, res, next));

export default router;
