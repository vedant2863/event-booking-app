import { Prisma } from '@prisma/client';

import { prisma } from '../../../shared/database/prisma';

export class SeatRepository {
  async findSeatsByIds(seatIds: string[], eventId: string) {
    return prisma.seat.findMany({
      where: {
        id: { in: seatIds },
        eventId,
      },
    });
  }

  async updateSeats(
    seatIds: string[],
    eventId: string,
    updateData: Prisma.SeatUncheckedUpdateManyInput
  ) {
    return prisma.seat.updateMany({
      where: {
        id: { in: seatIds },
        eventId,
      },
      data: updateData,
    });
  }

  async getSeatsByEvent(eventId: string) {
    return prisma.seat.findMany({
      where: { eventId },
      orderBy: [{ section: 'asc' }, { row: 'asc' }, { seatNumber: 'asc' }],
    });
  }

  async createSeats(seats: Prisma.SeatCreateManyInput[]) {
    return prisma.seat.createMany({
      data: seats,
      skipDuplicates: true,
    });
  }

  async acquireSeatLocks(
    seatIds: string[],
    eventId: string,
    userId: string,
    lockedUntil: Date,
    now: Date
  ) {
    return prisma.seat.updateMany({
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
  }
}

export const seatRepository = new SeatRepository();
