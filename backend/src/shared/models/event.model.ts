import mongoose, { Document, Schema } from 'mongoose';

import { EventCategory } from '../../shared/types';

export interface IVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  capacity: number;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  venue: IVenue;
  category: EventCategory;
  date: Date;
  endDate: Date;
  organizer: mongoose.Types.ObjectId;
  banner?: string;
  tags: string[];
  isPublished: boolean;
  isCancelled: boolean;
  totalSeats: number;
  availableSeats: number;
  minPrice: number;
  maxPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const venueSchema = new Schema<IVenue>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  capacity: { type: Number, required: true },
});

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    venue: { type: venueSchema, required: true },
    category: { type: String, enum: Object.values(EventCategory), required: true },
    date: { type: Date, required: true },
    endDate: { type: Date, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    banner: { type: String },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    minPrice: { type: Number, required: true, min: 0 },
    maxPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'venue.city': 1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
