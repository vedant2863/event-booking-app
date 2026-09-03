import { NextFunction, Request, Response } from 'express';

import { config } from '../../../shared/config/env';
import { UnauthorizedError } from '../../../shared/errors/AppError';
import { AuthenticatedRequest } from '../../../shared/types';
import ResponseFormatter from '../../../shared/utils/response';
import { LoginDto, RegisterDto } from '../dto/auth.types';
import { AuthService } from '../services/auth.service';
import { loginSchema, registerSchema } from '../validation/auth.validation';

const isProd = process.env.NODE_ENV === 'production';
const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
};

const EXPIRE_TIME_7D = 7 * 24 * 60 * 60 * 1000; // 7 days
const EXPIRE_TIME_15M = 15 * 60 * 1000; // 15 minutes

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = registerSchema.parse(req.body) as RegisterDto;
      const { user, tokens } = await this.authService.register(dto);

      res.cookie(config.jwt.accessTokenCookieName, tokens.accessToken, {
        ...cookieOpts,
        maxAge: EXPIRE_TIME_15M,
      });
      res.cookie(config.jwt.refreshTokenCookieName, tokens.refreshToken, {
        ...cookieOpts,
        maxAge: EXPIRE_TIME_7D,
      });

      ResponseFormatter.success(
        res,
        { user, accessToken: tokens.accessToken },
        'Registration successful',
        201
      );
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = loginSchema.parse(req.body) as LoginDto;
      const { user, tokens } = await this.authService.login(dto);

      res.cookie(config.jwt.accessTokenCookieName, tokens.accessToken, {
        ...cookieOpts,
        maxAge: EXPIRE_TIME_15M,
      });
      res.cookie(config.jwt.refreshTokenCookieName, tokens.refreshToken, {
        ...cookieOpts,
        maxAge: EXPIRE_TIME_7D,
      });

      ResponseFormatter.success(res, { user, accessToken: tokens.accessToken }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) throw new UnauthorizedError('Refresh token missing');

      const tokens = await this.authService.refresh(token);
      res.cookie(config.jwt.accessTokenCookieName, tokens.accessToken, {
        ...cookieOpts,
        maxAge: EXPIRE_TIME_15M,
      });
      res.cookie(config.jwt.refreshTokenCookieName, tokens.refreshToken, {
        ...cookieOpts,
        maxAge: EXPIRE_TIME_7D,
      });

      ResponseFormatter.success(res, { accessToken: tokens.accessToken }, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) await this.authService.logout(req.user.userId);
      res.clearCookie(config.jwt.accessTokenCookieName);
      res.clearCookie(config.jwt.refreshTokenCookieName);
      ResponseFormatter.success(res, null, 'Logged out');
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('User not authenticated');
      const user = await this.authService.me(userId);
      ResponseFormatter.success(res, user, 'Profile fetched');
    } catch (err) {
      next(err);
    }
  }
}
