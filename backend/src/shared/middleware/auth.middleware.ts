import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { AuthenticatedRequest, AuthPayload, UserRole } from '../types';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.accessToken;

    if (!token) throw new UnauthorizedError('No token provided');

    const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(err);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};
