import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: ApiResponse['pagination']
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: string
): Response => {
  const response: ApiResponse = { success: false, message, error };
  return res.status(statusCode).json(response);
};

export const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: Math.min(limit, 100) };
};
