import type { FilterQuery } from 'mongoose';

import { Event, IEvent } from '../../../shared/models/event.model';

import { BaseRepository } from './BaseRepository';

export class EventRepository extends BaseRepository<IEvent> {
  constructor() {
    super(Event);
  }

  async createEvent(data: Partial<IEvent>): Promise<IEvent> {
    return this.create(data);
  }

  async findEvents(filter: FilterQuery<IEvent>, skip: number, limit: number): Promise<IEvent[]> {
    return this.model
      .find(filter)
      .populate('organizer', 'username email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countEvents(filter: FilterQuery<IEvent>): Promise<number> {
    return this.count(filter);
  }

  async findById(id: string): Promise<IEvent | null> {
    return this.model.findById(id).populate('organizer', 'username email profileImage').exec();
  }

  async updateById(id: string, update: Partial<IEvent>): Promise<IEvent | null> {
    return super.updateById(id, update);
  }

  async deleteById(id: string): Promise<IEvent | null> {
    return super.deleteById(id);
  }

  async findOrganizerEvents(organizerId: string): Promise<IEvent[]> {
    return this.model.find({ organizer: organizerId }).sort({ createdAt: -1 }).exec();
  }
}
