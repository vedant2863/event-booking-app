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
  if (err instanceof AppError) {
    ResponseFormatter.error(res, err.message, err.statusCode);
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

  // Mongoose duplicate key
  if ((err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue || {})[0];
    ResponseFormatter.sendError(res, `${field} already exists`, 409);
    return;
  }

  logger.error(err);
  ResponseFormatter.sendError(res, 'Internal server error', 500);
};

export const notFound = (_req: Request, res: Response): void => {
  ResponseFormatter.sendError(res, 'Route not found', 404);
};
