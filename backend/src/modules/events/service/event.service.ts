import { Event, Prisma, Seat } from '@prisma/client';

import { prisma } from '../../../shared/database/prisma';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../shared/errors/AppError';
import { EventCategory, UserRole } from '../../../shared/types';
import { SeatRepository } from '../../seats/repository/seat.repository';
import { EventFilter, EventRepository } from '../repository/event.repository';

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
  private seatRepository: SeatRepository;

  constructor(
    private readonly eventRepository: EventRepository,
    seatRepo?: SeatRepository
  ) {
    this.seatRepository = seatRepo || new SeatRepository();
  }

  async createEvent(dto: CreateEventDto, organizerId: string) {
    if (new Date(dto.date) <= new Date())
      throw new ValidationError('Event date must be in the future');
    if (new Date(dto.endDate) <= new Date(dto.date))
      throw new ValidationError('End date must be after start date');

    let totalSeats = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    for (const section of dto.seatingLayout.sections) {
      const sectionSeats = section.rows.length * section.seatsPerRow;
      totalSeats += sectionSeats;
      if (section.price < minPrice) minPrice = section.price;
      if (section.price > maxPrice) maxPrice = section.price;
    }

    const event = await this.eventRepository.createEvent({
      ...dto,
      date: new Date(dto.date),
      endDate: new Date(dto.endDate),
      organizerId,
      totalSeats,
      availableSeats: totalSeats,
      minPrice,
      maxPrice,
    });

    const seats: Prisma.SeatCreateManyInput[] = [];
    for (const section of dto.seatingLayout.sections) {
      for (const row of section.rows) {
        for (let i = 1; i <= section.seatsPerRow; i++) {
          seats.push({
            eventId: event.id,
            seatNumber: `${row}${i}`,
            row,
            section: section.name,
            price: section.price,
            status: 'available',
          });
        }
      }
    }

    await this.seatRepository.createSeats(seats);

    return {
      ...event,
      _id: event.id,
    };
  }

  async getEvents(query: EventQuery) {
    const { page = 1, limit = 12, category, city, search } = query;
    const skip = (page - 1) * limit;

    const filter: EventFilter = {
      isPublished: true,
      isCancelled: false,
    };

    if (category) filter.category = category;
    if (city) filter.city = city;
    if (search) filter.search = search;

    const [events, total] = await Promise.all([
      this.eventRepository.findEvents(filter, skip, limit),
      this.eventRepository.countEvents(filter),
    ]);

    const formatted = events.map((e: Event) => ({
      ...e,
      _id: e.id,
    }));

    return {
      events: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getEventById(id: string) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundError('Event');
    return {
      ...event,
      _id: event.id,
    };
  }

  async getEventWithSeats(id: string) {
    const event = await this.getEventById(id);
    const seats: Seat[] = await prisma.seat.findMany({
      where: { eventId: id },
      orderBy: [{ section: 'asc' }, { row: 'asc' }, { seatNumber: 'asc' }],
    });

    const formattedSeats = seats.map((s: Seat) => ({
      ...s,
      _id: s.id,
    }));

    const layout: Record<string, Record<string, typeof formattedSeats>> = {};
    for (const seat of formattedSeats) {
      if (!layout[seat.section]) layout[seat.section] = {};
      if (!layout[seat.section][seat.row]) layout[seat.section][seat.row] = [];
      layout[seat.section][seat.row].push(seat);
    }

    return {
      event,
      layout,
    };
  }

  async updateEvent(id: string, dto: Partial<CreateEventDto>, userId: string, role: UserRole) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizerId !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized to update this event');

    const updateData: Prisma.EventUpdateInput = {};
    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.category) updateData.category = dto.category;
    if (dto.venue) updateData.venue = dto.venue;
    if (dto.banner !== undefined) updateData.banner = dto.banner;
    if (dto.tags) updateData.tags = dto.tags;
    if (dto.date) updateData.date = new Date(dto.date);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    const updated = await this.eventRepository.updateById(id, updateData);
    if (!updated) throw new NotFoundError('Event');
    return {
      ...updated,
      _id: updated.id,
    };
  }

  async publishEvent(id: string, userId: string, role: UserRole) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizerId !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized');

    const updated = await this.eventRepository.updateById(id, { isPublished: true });
    if (!updated) throw new NotFoundError('Event');
    return {
      ...updated,
      _id: updated.id,
    };
  }

  async cancelEvent(id: string, userId: string, role: UserRole) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizerId !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized');

    const updated = await this.eventRepository.updateById(id, { isCancelled: true });
    if (!updated) throw new NotFoundError('Event');
    return {
      ...updated,
      _id: updated.id,
    };
  }

  async deleteEvent(id: string, userId: string, role: UserRole) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundError('Event');
    if (event.organizerId !== userId && role !== UserRole.ADMIN)
      throw new ForbiddenError('Not authorized');

    await this.eventRepository.deleteById(id);
  }

  async getOrganizerEvents(organizerId: string) {
    const events = await this.eventRepository.findOrganizerEvents(organizerId);
    return events.map((e: Event) => ({
      ...e,
      _id: e.id,
    }));
  }
}
