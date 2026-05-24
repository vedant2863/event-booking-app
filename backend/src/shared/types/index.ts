import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum EventCategory {
  MUSIC = 'music',
  SPORTS = 'sports',
  TECH = 'tech',
  ART = 'art',
  FOOD = 'food',
  COMEDY = 'comedy',
  THEATRE = 'theatre',
  OTHER = 'other',
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type ObjectId = Types.ObjectId;
