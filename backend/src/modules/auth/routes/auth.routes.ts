import express from 'express';

import { authenticate } from '../../../shared/middleware/auth.middleware';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const authController = controller.authController;

router.route('/register')
  .post((req, res, next) => authController.register(req, res, next));

router.route('/login')
  .post((req, res, next) => authController.login(req, res, next));

router.route('/refresh')
  .post((req, res, next) => authController.refresh(req, res, next));

router.route('/logout')
  .post(authenticate, (req, res, next) => authController.logout(req, res, next));

router.route('/me')
  .get(authenticate, (req, res, next) => authController.me(req, res, next));

export default router;
