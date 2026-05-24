import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../../../shared/types';
import ResponseFormatter from '../../../shared/utils/response';
import { AdminService } from '../service/admin.service';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
