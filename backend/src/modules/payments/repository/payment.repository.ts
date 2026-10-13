import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { db } from '../../../shared/database/prisma';
import { CreatePaymentData } from '../types/payment.types';

export class PaymentRepository {
  async createPayment(data: CreatePaymentData) {
    return db.payment.create({
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
    return db.payment.findUnique({
      where: { id },
    });
  }

  async updatePaymentById(id: string, update: Prisma.PaymentUpdateInput) {
    return db.payment.update({
      where: { id },
      data: update,
    });
  }
}

export const paymentRepository = new PaymentRepository();
