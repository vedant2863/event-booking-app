import notificationsDependencies from '../../notifications/dependencies/dependencies';
import seatsDependencies from '../../seats/dependencies/dependencies';
import { BookingController } from '../controller/booking.controller';
import { BookingRepository } from '../repository/booking.repository';
import { BookingService } from '../service/booking.service';

/**
 * Dependency Injection Container for the Bookings module.
 * This container initializes and manages the dependencies for the Bookings module,
 * including repositories, services, and controllers.
 */
class Container {
  static init() {
    const repositories = {
      bookingRepository: new BookingRepository(),
    };

    const services = {
      bookingService: new BookingService(
        repositories.bookingRepository,
        seatsDependencies.services.seatService,
        notificationsDependencies.services.notificationService
      ),
    };

    const controller = {
      bookingController: new BookingController(services.bookingService),
    };

    return {
      repositories,
      services,
      controller,
    };
  }
}

const initialized = Container.init();
export { Container };
export default initialized;
