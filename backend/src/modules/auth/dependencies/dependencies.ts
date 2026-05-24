import { AuthController } from '../controller/auth.controller';
import { AuthRepository } from '../repository/auth.repository';
import { AuthService } from '../services/auth.service';

class Container {
  static init() {
    const repositories = {
      authRepository: new AuthRepository(),
    };

    const services = {
      authService: new AuthService(repositories.authRepository),
    };

    const controller = {
      authController: new AuthController(services.authService),
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
