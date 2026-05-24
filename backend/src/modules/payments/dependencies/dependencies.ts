import { PaymentRepository } from '../repository/payment.repository';

class Container {
  static init(): {
    repositories: { paymentRepository: PaymentRepository };
  } {
    const repositories = {
      paymentRepository: new PaymentRepository(),
    };

    return {
      repositories,
    };
  }
}

const initialized = Container.init();
export { Container };
export default initialized;
