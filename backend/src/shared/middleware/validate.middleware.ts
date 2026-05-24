import { NextFunction, Request, Response } from 'express';

import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
    } else {
      req.body = result.data;
      next();
    }
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(result.error);
    } else {
      req.query = result.data;
      next();
    }
  };
