import { EventController } from '../controller/event.controller';
import { EventRepository } from '../repository/event.repository';
import { EventService } from '../service/event.service';

/**
 * Dependency Injection Container for the Events module.
 * This container initializes and manages the dependencies for the Events module,
 * including repositories, services, and controllers.
 */
class Container {
  static init() {
    const repositories = {
      eventRepository: new EventRepository(),
    };

    const services = {
      eventService: new EventService(repositories.eventRepository),
    };

    const controller = {
      eventController: new EventController(services.eventService),
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
