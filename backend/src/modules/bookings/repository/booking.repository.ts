import { Booking, IBooking } from '../../../shared/models/booking.model';

import { BaseRepository } from './BaseRepository';

export class BookingRepository extends BaseRepository<IBooking> {
  constructor() {
    super(Booking);
  }

  async create(data: Partial<IBooking>) {
    return super.create(data);
  }

  async findById(id: string) {
    return super.findById(id);
  }

  async updateById(id: string, update: Partial<IBooking>) {
    return super.updateById(id, update);
  }

  async findByUser(userId: string, skip: number, limit: number) {
    const [bookings, total] = await Promise.all([
      this.model
        .find({ userId })
        .populate('eventId', 'title date venue banner')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments({ userId }),
    ]);

    return { bookings, total };
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      this.model
        .find()
        .populate('userId', 'username email')
        .populate('eventId', 'title date')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(),
    ]);

    return { bookings, total };
  }
}

export const bookingRepository = new BookingRepository();
