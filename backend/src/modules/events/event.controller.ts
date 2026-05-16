import { Response, NextFunction } from 'express';
import { eventService } from './event.service';
import { AuthenticatedRequest } from '../../shared/types';
import { sendSuccess } from '../../shared/utils/response';

export class EventController {
  async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.createEvent(req.body, req.user!.userId);
      sendSuccess(res, event, 'Event created', 201);
    } catch (err) { next(err); }
  }

  async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, category, city, search, dateFrom, dateTo } = req.query as any;
      const result = await eventService.getEvents({ page: +page || 1, limit: +limit || 12, category, city, search, dateFrom, dateTo });
      sendSuccess(res, result.events, 'Events fetched', 200, result.pagination);
    } catch (err) { next(err); }
  }

  async getEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getEventById(req.params.id);
      sendSuccess(res, event, 'Event fetched');
    } catch (err) { next(err); }
  }

  async getEventWithSeats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await eventService.getEventWithSeats(req.params.id);
      sendSuccess(res, result, 'Event seats fetched');
    } catch (err) { next(err); }
  }

  async updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body, req.user!.userId, req.user!.role);
      sendSuccess(res, event, 'Event updated');
    } catch (err) { next(err); }
  }

  async publishEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.publishEvent(req.params.id, req.user!.userId, req.user!.role);
      sendSuccess(res, event, 'Event published');
    } catch (err) { next(err); }
  }

  async cancelEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.cancelEvent(req.params.id, req.user!.userId, req.user!.role);
      sendSuccess(res, event, 'Event cancelled');
    } catch (err) { next(err); }
  }

  async deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await eventService.deleteEvent(req.params.id, req.user!.userId, req.user!.role);
      sendSuccess(res, null, 'Event deleted');
    } catch (err) { next(err); }
  }

  async getMyEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getOrganizerEvents(req.user!.userId);
      sendSuccess(res, events, 'My events fetched');
    } catch (err) { next(err); }
  }
}

export const eventController = new EventController();
