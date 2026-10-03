import { Prisma } from '@prisma/client';

import { prisma } from '../../../shared/database/prisma';

export interface EventFilter {
  category?: string;
  city?: string;
  search?: string;
  isPublished?: boolean;
  isCancelled?: boolean;
}

export interface CreateEventRepoData {
  title: string;
  description: string;
  category: string;
  venue: Prisma.InputJsonValue;
  date: Date;
  endDate?: Date;
  organizerId: string;
  banner?: string;
  tags?: string[];
  isPublished?: boolean;
  totalSeats: number;
  availableSeats: number;
  minPrice: number;
  maxPrice: number;
}

export class EventRepository {
  async createEvent(data: CreateEventRepoData) {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        venue: data.venue,
        date: data.date,
        endDate: data.endDate,
        organizerId: data.organizerId,
        banner: data.banner,
        tags: data.tags || [],
        isPublished: data.isPublished ?? true,
        totalSeats: data.totalSeats,
        availableSeats: data.availableSeats,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      },
      include: {
        organizer: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });
  }

  private buildWhereClause(filter: EventFilter): Prisma.EventWhereInput {
    const andClauses: Prisma.EventWhereInput[] = [];

    if (filter.isPublished !== undefined) {
      andClauses.push({ isPublished: filter.isPublished });
    }
    if (filter.isCancelled !== undefined) {
      andClauses.push({ isCancelled: filter.isCancelled });
    }
    if (filter.category) {
      andClauses.push({ category: { equals: filter.category, mode: 'insensitive' } });
    }
    if (filter.search) {
      andClauses.push({
        OR: [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      });
    }

    if (
      filter.city &&
      filter.city.toLowerCase() !== 'all' &&
      filter.city.toLowerCase() !== 'all cities'
    ) {
      const rawCity = filter.city.trim();
      const lower = rawCity.toLowerCase();
      const title = lower.charAt(0).toUpperCase() + lower.slice(1);
      const upper = rawCity.toUpperCase();
      const cityVariations = Array.from(new Set([rawCity, lower, title, upper]));

      const venueCityOr: Prisma.EventWhereInput[] = cityVariations.map((c) => ({
        venue: { path: ['city'], string_contains: c },
      }));

      if (filter.category === 'movie') {
        // Movies are available across all cities
      } else if (filter.category) {
        // Specific live event category -> match any casing of city
        andClauses.push({ OR: venueCityOr });
      } else {
        // General catalog: Show all movies OR events in the selected city (any casing)
        andClauses.push({
          OR: [{ category: { equals: 'movie', mode: 'insensitive' } }, ...venueCityOr],
        });
      }
    }

    if (andClauses.length === 0) return {};
    if (andClauses.length === 1) return andClauses[0];
    return { AND: andClauses };
  }

  async findEvents(filter: EventFilter, skip: number, limit: number) {
    const where = this.buildWhereClause(filter);

    return prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'asc' },
      include: {
        organizer: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });
  }

  async countEvents(filter: EventFilter): Promise<number> {
    const where = this.buildWhereClause(filter);
    return prisma.event.count({ where });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });
  }

  async updateById(id: string, update: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data: update,
      include: {
        organizer: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });
  }

  async deleteById(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }

  async findOrganizerEvents(organizerId: string) {
    return prisma.event.findMany({
      where: { organizerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(): Promise<number> {
    return prisma.event.count();
  }
}

export const eventRepository = new EventRepository();
