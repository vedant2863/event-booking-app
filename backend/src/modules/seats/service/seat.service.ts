import { getRedis } from '../../../shared/database/redis';
import { ConflictError, NotFoundError } from '../../../shared/errors/AppError';
import { Seat, SeatStatus } from '../../../shared/models/seat.model';
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
    const seats = await this.seatRepository.findSeatsByIds(seatIds, eventId);

    if (seats.length !== seatIds.length) throw new NotFoundError('One or more seats');

    // Check all are available
    const unavailable = seats.filter((s) => s.status !== SeatStatus.AVAILABLE);
    if (unavailable.length > 0)
      throw new ConflictError(
        `Seats ${unavailable.map((s) => s.seatNumber).join(', ')} are not available`
      );

    // Try to acquire Redis locks atomically
    const pipeline = redis.pipeline(); // Use pipeline for atomicity
    for (const seat of seats) {
      const key = this.getLockKey(eventId, seat._id.toString());
      pipeline.set(key, userId, 'EX', LOCK_TTL, 'NX'); // Set if not exists with TTL
    }

    const results = await pipeline.exec();
    const allLocked = results?.every(([err, result]) => !err && result === 'OK');

    if (!allLocked) {
      // Release any locks we did acquire
      await this.releaseLocksForUser(seatIds, eventId, userId);
      throw new ConflictError('Some seats were just taken. Please try again.');
    }

    // Update DB status
    const lockedUntil = new Date(Date.now() + LOCK_TTL * 1000); // Convert to milliseconds i.e. 5 minutes from now
    await Seat.updateMany(
      { _id: { $in: seatIds }, eventId },
      { status: SeatStatus.LOCKED, lockedBy: userId, lockedUntil }
    );

    return true;
  }

  async releaseLocksForUser(seatIds: string[], eventId: string, userId: string): Promise<void> {
    const redis = getRedis();
    const pipeline = redis.pipeline();

    for (const seatId of seatIds) {
      const key = this.getLockKey(eventId, seatId);
      // Only delete if user owns the lock
      pipeline.eval(
        `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`,
        1,
        key,
        userId
      );
    }
    await pipeline.exec();

    await Seat.updateMany(
      { _id: { $in: seatIds }, eventId, lockedBy: userId },
      { status: SeatStatus.AVAILABLE, lockedBy: undefined, lockedUntil: undefined }
    );
  }

  async confirmSeats(
    seatIds: string[],
    eventId: string,
    userId: string,
    bookingId: string
  ): Promise<void> {
    await this.seatRepository.updateSeats(seatIds, eventId, {
      status: SeatStatus.BOOKED,
      bookedBy: userId,
      bookingId,
      lockedBy: undefined,
      lockedUntil: undefined,
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
    await Seat.updateMany(
      { _id: { $in: seatIds }, eventId },
      {
        status: SeatStatus.AVAILABLE,
        bookedBy: undefined,
        bookingId: undefined,
        lockedBy: undefined,
        lockedUntil: undefined,
      }
    );

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
