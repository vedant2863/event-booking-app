import { IPayment, Payment } from '../../../shared/models/payment.model';

import { BaseRepository } from './BaseRepository';

export class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(Payment);
  }

  async createPayment(data: Partial<IPayment>) {
    return this.create(data);
  }

  async findPaymentById(id: string) {
    return this.findById(id);
  }

  async updatePaymentById(id: string, update: Partial<IPayment>) {
    return this.updateById(id, update);
  }
}

export const paymentRepository = new PaymentRepository();
