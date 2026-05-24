import express from 'express';

import { authenticate } from '../../../shared/middleware/auth.middleware';
import dependencies from '../dependencies/dependencies';

const router = express.Router();
const { controller } = dependencies;
const authController = controller.authController;

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));

export default router;
