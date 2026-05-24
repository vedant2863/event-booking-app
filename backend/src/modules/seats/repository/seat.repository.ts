import type { UpdateQuery } from 'mongoose';

import { ISeat, Seat } from '../../../shared/models/seat.model';

import { BaseRepository } from './BaseRepository';

export class SeatRepository extends BaseRepository<ISeat> {
  constructor() {
    super(Seat);
  }

  async findSeatsByIds(seatIds: string[], eventId: string) {
    return this.model.find({
      _id: { $in: seatIds },
      eventId,
    });
  }

  async updateSeats(seatIds: string[], eventId: string, update: UpdateQuery<ISeat>) {
    return this.model.updateMany(
      {
        _id: { $in: seatIds },
        eventId,
      },
      update
    );
  }

  async getSeatsByEvent(eventId: string) {
    return this.model.find({ eventId }).sort({
      section: 1,
      row: 1,
    });
  }
}

export const seatRepository = new SeatRepository();
