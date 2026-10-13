import { Prisma } from '@prisma/client';
import { EventCategory } from '../../../shared/types';

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
  sort?: string;
}

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
