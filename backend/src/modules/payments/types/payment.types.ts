import { Prisma } from '@prisma/client';

export interface CreatePaymentData {
  bookingId: string;
  userId: string;
  amount: number;
  currency?: string;
  provider?: string;
  transactionId?: string;
  status?: string;
  paymentDetails?: Prisma.InputJsonValue;
}
