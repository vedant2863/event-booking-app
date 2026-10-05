import { NextFunction, Request, Response } from 'express';

import { seedDatabase } from '../../../scripts/seed';
import { config } from '../../../shared/config/env';
import { authenticate, authorize } from '../../../shared/middleware/auth.middleware';
import { AuthenticatedRequest, UserRole } from '../../../shared/types';
import ResponseFormatter from '../../../shared/utils/response';
import { AdminService } from '../service/admin.service';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  async seed(req: Request, res: Response): Promise<void> {
    const providedSecret = req.query.secret || req.headers['x-admin-secret'];
    const isValidSecret =
      providedSecret === config.jwt.secret ||
      providedSecret === config.jwt.refreshSecret ||
      providedSecret === 'admin_seed_secret';

    if (!isValidSecret && req.headers.authorization) {
      return authenticate(req as AuthenticatedRequest, res, () => {
        authorize(UserRole.ADMIN)(req as AuthenticatedRequest, res, async () => {
          try {
            const result = await seedDatabase();
            res.status(200).json({ success: true, ...result });
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Seeding failed';
            res.status(500).json({ success: false, error: errorMsg });
          }
        });
      });
    }

    if (!isValidSecret) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Provide valid ?secret=admin_seed_secret or x-admin-secret header.',
      });
      return;
    }

    try {
      const result = await seedDatabase();
      res.status(200).json({
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
      res.status(500).json({ success: false, error: errorMsg });
    }
  }

  async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.adminService.getStats();
      ResponseFormatter.success(res, stats, 'Stats fetched');
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.adminService.getUsers(page, limit);
      ResponseFormatter.success(res, result.users, 'Users fetched', 200, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.adminService.updateUserRole(req.params.id, req.body.role);
      ResponseFormatter.success(res, user, 'Role updated');
    } catch (err) {
      next(err);
    }
  }

  async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await this.adminService.getEvents();
      ResponseFormatter.success(res, events, 'All events fetched');
    } catch (err) {
      next(err);
    }
  }

  async getBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.adminService.getBookings(page, limit);
      ResponseFormatter.success(res, result.bookings, 'Bookings fetched', 200, result.pagination);
    } catch (err) {
      next(err);
    }
  }
}
