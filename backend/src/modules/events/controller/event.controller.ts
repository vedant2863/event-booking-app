import { NextFunction, Response } from 'express';

import { AuthenticatedRequest, EventCategory } from '../../../shared/types';
import ResponseFormatter from '../../../shared/utils/response';
import { EventService } from '../service/event.service';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.createEvent(req.body, req.user!.userId);
      ResponseFormatter.success(res, event, 'Event created', 201);
    } catch (err) {
      next(err);
    }
  }

  async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query as {
        page?: string;
        limit?: string;
        category?: string;
        city?: string;
        search?: string;
        dateFrom?: string;
        dateTo?: string;
      };
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 12;
      const result = await this.eventService.getEvents({
        page,
        limit,
        category: query.category as EventCategory | undefined,
        city: query.city,
        search: query.search,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      });
      ResponseFormatter.success(res, result.events, 'Events fetched', 200, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  async getEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      ResponseFormatter.success(res, event, 'Event fetched');
    } catch (err) {
      next(err);
    }
  }

  async getEventWithSeats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.eventService.getEventWithSeats(req.params.id);
      ResponseFormatter.success(res, result, 'Event seats fetched');
    } catch (err) {
      next(err);
    }
  }

  async updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.updateEvent(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      ResponseFormatter.success(res, event, 'Event updated');
    } catch (err) {
      next(err);
    }
  }

  async publishEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.publishEvent(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );
      ResponseFormatter.success(res, event, 'Event published');
    } catch (err) {
      next(err);
    }
  }

  async cancelEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.cancelEvent(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );
      ResponseFormatter.success(res, event, 'Event cancelled');
    } catch (err) {
      next(err);
    }
  }

  async deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.eventService.deleteEvent(req.params.id, req.user!.userId, req.user!.role);
      ResponseFormatter.success(res, null, 'Event deleted');
    } catch (err) {
      next(err);
    }
  }

  async getMyEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const events = await this.eventService.getOrganizerEvents(req.user!.userId);
      ResponseFormatter.success(res, events, 'My events fetched');
    } catch (err) {
      next(err);
    }
  }
}
