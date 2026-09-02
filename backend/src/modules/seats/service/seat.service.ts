import { Seat } from '@prisma/client';

import { getRedis } from '../../../shared/database/redis';
import { ConflictError, NotFoundError } from '../../../shared/errors/AppError';
import { SeatRepository } from '../repository/seat.repository';

const LOCK_TTL = 300; // 5 minutes in seconds
const LOCK_PREFIX = 'seat:lock:';

export class SeatService {
  constructor(private seatRepository: SeatRepository) {}

  private getLockKey(eventId: string, seatId: string): string {
    return `${LOCK_PREFIX}${eventId}:${seatId}`;
  }

  async lockSeats(seatIds: string[], eventId: string, userId: string): Promise<boolean> {
    const redis = getRedis();
    const seats: Seat[] = await this.seatRepository.findSeatsByIds(seatIds, eventId);

    if (seats.length !== seatIds.length) throw new NotFoundError('One or more seats');

    // Check all are available
    const unavailable = seats.filter((s: Seat) => s.status !== 'available');
    if (unavailable.length > 0)
      throw new ConflictError(
        `Seats ${unavailable.map((s: Seat) => s.seatNumber).join(', ')} are not available`
      );

    // Try to acquire Redis locks atomically
    const pipeline = redis.pipeline();
    for (const seat of seats) {
      const key = this.getLockKey(eventId, seat.id);
      pipeline.set(key, userId, 'EX', LOCK_TTL, 'NX');
    }

    const results = await pipeline.exec();
    const allLocked = results?.every(([err, result]) => !err && result === 'OK');

    if (!allLocked) {
      await this.releaseLocksForUser(seatIds, eventId, userId);
      throw new ConflictError('Some seats were just taken. Please try again.');
    }

    // Update DB status in PostgreSQL via Prisma
    const lockedUntil = new Date(Date.now() + LOCK_TTL * 1000);
    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: 'locked',
      lockedBy: userId,
      lockedUntil,
    });

    return true;
  }

  async releaseLocksForUser(seatIds: string[], eventId: string, userId: string): Promise<void> {
    const redis = getRedis();
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

    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: 'available',
      lockedBy: null,
      lockedUntil: null,
    });
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

    // Remove Redis locks
    const redis = getRedis();
    const pipeline = redis.pipeline();
    for (const seatId of seatIds) {
      pipeline.del(this.getLockKey(eventId, seatId));
    }
    await pipeline.exec();
  }

  async releaseSeats(seatIds: string[], eventId: string): Promise<void> {
    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: 'available',
      bookedBy: null,
      bookingId: null,
      lockedBy: null,
      lockedUntil: null,
    });

    const redis = getRedis();
    const pipeline = redis.pipeline();
    for (const seatId of seatIds) {
      pipeline.del(this.getLockKey(eventId, seatId));
    }
    await pipeline.exec();
  }

  async getSeatsByEvent(eventId: string) {
    return this.seatRepository.getSeatsByEvent(eventId);
  }

  async checkLockStatus(seatIds: string[], eventId: string, _userId: string) {
    const redis = getRedis();
    const pipeline = redis.pipeline();
    for (const seatId of seatIds) {
      pipeline.ttl(this.getLockKey(eventId, seatId));
    }
    const results = await pipeline.exec();
    return results?.map(([, ttl]) => ({ ttl }));
  }
}
