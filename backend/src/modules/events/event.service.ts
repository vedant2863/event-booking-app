import { Event, IEvent } from './event.model';
import { Seat, SeatStatus } from '../seats/seat.model';
import { NotFoundError, ForbiddenError, ValidationError } from '../../shared/errors/AppError';
import { EventCategory, UserRole } from '../../shared/types';
import mongoose from 'mongoose';

export interface CreateEventDto {
  title: string;
  description: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    capacity: number;
  };
  category: EventCategory;
  date: string;
  endDate: string;
  banner?: string;
  tags?: string[];
  seatingLayout: {
    sections: {
      name: string;
      rows: string[];
      seatsPerRow: number;
      price: number;
    }[];
  };
}

export interface EventQuery {
  page?: number;
  limit?: number;
  category?: EventCategory;
  city?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class EventService {
  async createEvent(dto: CreateEventDto, organizerId: string) {
    if (new Date(dto.date) <= new Date()) throw new ValidationError('Event date must be in the future');
    if (new Date(dto.endDate) <= new Date(dto.date)) throw new ValidationError('End date must be after start date');

    // Calculate seat counts and pricing
    let totalSeats = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    for (const section of dto.seatingLayout.sections) {
      const sectionSeats = section.rows.length * section.seatsPerRow;
      totalSeats += sectionSeats;
      if (section.price < minPrice) minPrice = section.price;
      if (section.price > maxPrice) maxPrice = section.price;
    }

    const event = await Event.create({
      ...dto,
      date: new Date(dto.date),
      endDate: new Date(dto.endDate),
      organizer: organizerId,
      totalSeats,
      availableSeats: totalSeats,
      minPrice,
      maxPrice,
    });

    // Generate seats
    const seats = [];
    for (const section of dto.seatingLayout.sections) {
      for (const row of section.rows) {
        for (let i = 1; i <= section.seatsPerRow; i++) {
          seats.push({
            eventId: event._id,
            seatNumber: `${row}${i}`,
            row,
            section: section.name,
            price: section.price,
            status: SeatStatus.AVAILABLE,
          });
        }
      }
    }
    await Seat.insertMany(seats);

    return event;
  }

  async getEvents(query: EventQuery) {
    const { page = 1, limit = 12, category, city, search, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      isPublished: true,
      isCancelled: false,
      date: { $gte: new Date() },
    };

    if (category) filter.category = category;
    if (city) filter['venue.city'] = new RegExp(city, 'i');
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
    if (search) filter.$text = { $search: search };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'username email')
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(filter),
    ]);

    return {
      events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getEventById(id: string) {
    const event = await Event.findById(id).populate('organizer', 'username email profileImage');
    if (!event) throw new NotFoundError('Event');
    return event;
  }

  async getEventWithSeats(id: string) {
    const event = await this.getEventById(id);
    const seats = await Seat.find({ eventId: id }).sort({ section: 1, row: 1, seatNumber: 1 });

    // Group seats by section → row
    const layout: Record<string, Record<string, typeof seats>> = {};
    for (const seat of seats) {
      if (!layout[seat.section]) layout[seat.section] = {};
      if (!layout[seat.section][seat.row]) layout[seat.section][seat.row] = [];
      layout[seat.section][seat.row].push(seat);
    }

    return { event, layout };
  }

  async updateEvent(id: string, dto: Partial<CreateEventDto>, userId: string, role: UserRole) {
    const event = await Event.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizer.toString() !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized to update this event');

    Object.assign(event, dto);
    if (dto.date) event.date = new Date(dto.date);
    if (dto.endDate) event.endDate = new Date(dto.endDate);
    await event.save();
    return event;
  }

  async publishEvent(id: string, userId: string, role: UserRole) {
    const event = await Event.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizer.toString() !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized');

    event.isPublished = true;
    await event.save();
    return event;
  }

  async cancelEvent(id: string, userId: string, role: UserRole) {
    const event = await Event.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizer.toString() !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized');

    event.isCancelled = true;
    await event.save();
    return event;
  }

  async deleteEvent(id: string, userId: string, role: UserRole) {
    const event = await Event.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizer.toString() !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized');

    await Promise.all([
      Event.findByIdAndDelete(id),
      Seat.deleteMany({ eventId: id }),
    ]);
  }

  async getOrganizerEvents(organizerId: string) {
    return Event.find({ organizer: organizerId }).sort({ createdAt: -1 });
  }
}

export const eventService = new EventService();
