import { NextFunction, Request, Response } from 'express';

import { ZodError } from 'zod';

import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import ResponseFormatter from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError || (err && typeof (err as unknown as { statusCode?: number }).statusCode === 'number')) {
    const statusCode = (err as unknown as { statusCode: number }).statusCode || 500;
    ResponseFormatter.error(res, err.message, statusCode);
    return;
  }

  if (err instanceof ZodError) {
    ResponseFormatter.sendError(
      res,
      'Validation failed',
      400,
      err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
    );
    return;
  }

  // Prisma unique constraint violation
  if ((err as unknown as { code?: string }).code === 'P2002') {
    const target = (err as unknown as { meta?: { target?: string[] | string } }).meta?.target;
    const field = Array.isArray(target) ? target.join(', ') : target || 'Field';
    ResponseFormatter.sendError(res, `${field} already exists`, 409);
    return;
  }

  // Prisma record not found
  if ((err as unknown as { code?: string }).code === 'P2025') {
    ResponseFormatter.sendError(res, 'Record not found', 404);
    return;
  }

  // Mongoose duplicate key fallback
  if ((err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue || {})[0];
    ResponseFormatter.sendError(res, `${field} already exists`, 409);
    return;
  }

  logger.error(err);
  ResponseFormatter.sendError(
    res,
    err.message || 'Internal server error',
    500,
    err.message
  );
};

export const notFound = (_req: Request, res: Response): void => {
  ResponseFormatter.sendError(res, 'Route not found', 404);
};
