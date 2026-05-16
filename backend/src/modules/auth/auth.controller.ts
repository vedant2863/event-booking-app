import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';
import { AuthenticatedRequest } from '../../shared/types';
import { sendSuccess } from '../../shared/utils/response';
import { UnauthorizedError } from '../../shared/errors/AppError';

const registerSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'organizer']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = registerSchema.parse(req.body);
      const { user, tokens } = await authService.register(dto);

      res.cookie('accessToken', tokens.accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', tokens.refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

      sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = loginSchema.parse(req.body);
      const { user, tokens } = await authService.login(dto);

      res.cookie('accessToken', tokens.accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', tokens.refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

      sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) throw new UnauthorizedError('Refresh token missing');

      const tokens = await authService.refresh(token);
      res.cookie('accessToken', tokens.accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', tokens.refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

      sendSuccess(res, { accessToken: tokens.accessToken }, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) await authService.logout(req.user.userId);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      sendSuccess(res, null, 'Logged out');
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { User } = await import('../users/user.model');
      const user = await User.findById(req.user?.userId);
      sendSuccess(res, user, 'Profile fetched');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
