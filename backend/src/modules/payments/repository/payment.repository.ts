import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../../../shared/database/prisma';

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

export class PaymentRepository {
  async createPayment(data: CreatePaymentData) {
    return prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency || 'INR',
        provider: data.provider || 'RAZORPAY',
        transactionId: data.transactionId || `tx_${uuidv4().replace(/-/g, '')}`,
        status: data.status || 'pending',
        paymentDetails: data.paymentDetails,
      },
    });
  }

  async findPaymentById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
    });
  }

  async updatePaymentById(id: string, update: Prisma.PaymentUpdateInput) {
    return prisma.payment.update({
      where: { id },
      data: update,
    });
  }
}

export const paymentRepository = new PaymentRepository();
