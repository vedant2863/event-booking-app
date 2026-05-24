import mongoose, { Document, Schema } from 'mongoose';

export enum SeatStatus {
  AVAILABLE = 'available',
  LOCKED = 'locked',
  BOOKED = 'booked',
}

export interface ISeat extends Document {
  eventId: mongoose.Types.ObjectId;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
  status: SeatStatus;
  lockedBy?: mongoose.Types.ObjectId;
  lockedUntil?: Date;
  bookedBy?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const seatSchema = new Schema<ISeat>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seatNumber: { type: String, required: true },
    row: { type: String, required: true },
    section: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(SeatStatus), default: SeatStatus.AVAILABLE },
    lockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lockedUntil: { type: Date },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
);

seatSchema.index({ eventId: 1, status: 1 });
seatSchema.index({ eventId: 1, section: 1 });
seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

export const Seat = mongoose.model<ISeat>('Seat', seatSchema);
