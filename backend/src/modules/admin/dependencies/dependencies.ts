import { AdminController } from '../controller/admin.controller';
import { AdminRepository } from '../repository/admin.repository';
import { AdminService } from '../service/admin.service';

/**
 * Dependency Injection Container for the Admin module.
 * This container initializes and manages the dependencies for the Admin module,
 * including repositories, services, and controllers.
 */
class Container {
  static init() {
    const repositories = {
      adminRepository: new AdminRepository(),
    };

    const services = {
      adminService: new AdminService(repositories.adminRepository),
    };

    const controller = {
      adminController: new AdminController(services.adminService),
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
