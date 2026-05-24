import mongoose, { Document, Schema } from 'mongoose';

import { BookingStatus, PaymentStatus } from '../../shared/types';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  seats: mongoose.Types.ObjectId[];
  seatDetails: { seatNumber: string; section: string; row: string; price: number }[];
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: mongoose.Types.ObjectId;
  bookingReference: string;
  expiresAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seats: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
    seatDetails: [
      {
        seatNumber: String,
        section: String,
        row: String,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    bookingReference: { type: String, unique: true },
    expiresAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ eventId: 1 });
// bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
