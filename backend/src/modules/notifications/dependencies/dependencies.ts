import { NotificationController } from '../controller/notification.controller';
import { NotificationRepository } from '../repository/notification.repository';
import { NotificationService } from '../service/notification.service';

class Container {
  static init(): {
    repositories: { notificationRepository: NotificationRepository };
    services: { notificationService: NotificationService };
    controller: { notificationController: NotificationController };
  } {
    const repositories = {
      notificationRepository: new NotificationRepository(),
    };

    const services = {
      notificationService: new NotificationService(),
    };

    const controller = {
      notificationController: new NotificationController(services.notificationService),
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
