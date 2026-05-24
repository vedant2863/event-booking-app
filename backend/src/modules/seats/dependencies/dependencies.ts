import { SeatRepository } from '../repository/seat.repository';
import { SeatService } from '../service/seat.service';

class Container {
  static init(): {
    repositories: { seatRepository: SeatRepository };
    services: { seatService: SeatService };
  } {
    const repositories = {
      seatRepository: new SeatRepository(),
    };

    const services = {
      seatService: new SeatService(repositories.seatRepository),
    };

    return {
      repositories,
      services,
    };
  }
}

const initialized = Container.init();
export { Container };
export default initialized;
