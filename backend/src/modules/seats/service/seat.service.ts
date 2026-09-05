import { Seat } from '@prisma/client';

import { prisma } from '../../../shared/database/prisma';
import { getRedis, isRedisAvailable } from '../../../shared/database/redis';
import { ConflictError, NotFoundError } from '../../../shared/errors/AppError';
import { logger } from '../../../shared/utils/logger';
import { SeatRepository } from '../repository/seat.repository';

const LOCK_TTL = 300; // 5 minutes in seconds
const LOCK_PREFIX = 'seat:lock:';

export class SeatService {
  constructor(private seatRepository: SeatRepository) {}

  private getLockKey(eventId: string, seatId: string): string {
    return `${LOCK_PREFIX}${eventId}:${seatId}`;
  }

  async lockSeats(seatIds: string[], eventId: string, userId: string): Promise<boolean> {
    const seats: Seat[] = await this.seatRepository.findSeatsByIds(seatIds, eventId);

    if (seats.length !== seatIds.length) throw new NotFoundError('One or more seats');

    const now = new Date();

    // Check if any seat is already booked, or actively locked by another user
    const unavailable = seats.filter((s: Seat) => {
      if (s.status === 'booked') return true;
      if (s.status === 'locked') {
        const isLockedByOther = s.lockedBy && s.lockedBy !== userId;
        const isLockActive = s.lockedUntil && s.lockedUntil > now;
        if (isLockedByOther && isLockActive) return true;
      }
      return false;
    });

    if (unavailable.length > 0) {
      throw new ConflictError(
        `Seats ${unavailable.map((s: Seat) => s.seatNumber).join(', ')} are not available`
      );
    }

    const lockedUntil = new Date(now.getTime() + LOCK_TTL * 1000);

    // Atomically acquire lock in PostgreSQL
    const updateResult = await prisma.seat.updateMany({
      where: {
        id: { in: seatIds },
        eventId,
        OR: [
          { status: 'available' },
          { status: 'locked', lockedUntil: { lt: now } },
          { status: 'locked', lockedBy: userId },
        ],
      },
      data: {
        status: 'locked',
        lockedBy: userId,
        lockedUntil,
      },
    });

    if (updateResult.count !== seatIds.length) {
      throw new ConflictError('Some seats were just taken. Please try again.');
    }

    // Try to sync lock in Redis if available
    if (isRedisAvailable()) {
      try {
        const redis = getRedis();
        if (redis) {
          const pipeline = redis.pipeline();
          for (const seat of seats) {
            const key = this.getLockKey(eventId, seat.id);
            pipeline.set(key, userId, 'EX', LOCK_TTL);
          }
          await pipeline.exec();
        }
      } catch (redisErr) {
        logger.warn('Redis lock sync skipped:', redisErr);
      }
    }

    return true;
  }

  async releaseLocksForUser(seatIds: string[], eventId: string, userId: string): Promise<void> {
    // Release in PostgreSQL
    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: 'available',
      lockedBy: null,
      lockedUntil: null,
    });

    // Release in Redis if available
    if (isRedisAvailable()) {
      try {
        const redis = getRedis();
        if (redis) {
          const pipeline = redis.pipeline();
          for (const seatId of seatIds) {
            const key = this.getLockKey(eventId, seatId);
            pipeline.eval(
              `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`,
              1,
              key,
              userId
            );
          }
          await pipeline.exec();
        }
      } catch (err) {
        logger.warn('Redis lock release skipped:', err);
      }
    }
  }

  async confirmSeats(
    seatIds: string[],
    eventId: string,
    userId: string,
    bookingId: string
  ): Promise<void> {
    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: 'booked',
      bookedBy: userId,
      bookingId,
      lockedBy: null,
      lockedUntil: null,
    });

    // Remove Redis locks if available
    if (isRedisAvailable()) {
      try {
        const redis = getRedis();
        if (redis) {
          const pipeline = redis.pipeline();
          for (const seatId of seatIds) {
            pipeline.del(this.getLockKey(eventId, seatId));
          }
          await pipeline.exec();
        }
      } catch (err) {
        logger.warn('Redis confirm delete skipped:', err);
      }
    }
  }

  async releaseSeats(seatIds: string[], eventId: string): Promise<void> {
    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: 'available',
      bookedBy: null,
      bookingId: null,
      lockedBy: null,
      lockedUntil: null,
    });

    if (isRedisAvailable()) {
      try {
        const redis = getRedis();
        if (redis) {
          const pipeline = redis.pipeline();
          for (const seatId of seatIds) {
            pipeline.del(this.getLockKey(eventId, seatId));
          }
          await pipeline.exec();
        }
      } catch (err) {
        logger.warn('Redis release delete skipped:', err);
      }
    }
  }

  async getSeatsByEvent(eventId: string) {
    return this.seatRepository.getSeatsByEvent(eventId);
  }

  async checkLockStatus(seatIds: string[], eventId: string, _userId: string) {
    if (isRedisAvailable()) {
      try {
        const redis = getRedis();
        if (redis) {
          const pipeline = redis.pipeline();
          for (const seatId of seatIds) {
            pipeline.ttl(this.getLockKey(eventId, seatId));
          }
          const results = await pipeline.exec();
          return results?.map(([, ttl]) => ({ ttl }));
        }
      } catch {
        // Fall back to database calculation
      }
    }

    const seats = await this.seatRepository.findSeatsByIds(seatIds, eventId);
    const now = Date.now();
    return seats.map((s) => {
      if (s.status === 'locked' && s.lockedUntil) {
        const ttl = Math.max(0, Math.floor((s.lockedUntil.getTime() - now) / 1000));
        return { ttl };
      }
      return { ttl: -2 };
    });
  }
}
