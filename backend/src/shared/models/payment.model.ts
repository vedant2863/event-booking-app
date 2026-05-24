import mongoose, { Document, Schema } from 'mongoose';

import { PaymentStatus } from '../../shared/types';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
  failureReason?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    provider: { type: String, default: 'simulated' },
    transactionId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    failureReason: { type: String },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
