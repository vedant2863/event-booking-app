import { Response } from 'express';

import { ApiResponse } from '../types';

/**
 * ResponseFormatter - Utility class for formatting API responses
 */
class ResponseFormatter {
  /**
   * Success response
   */
  static success<T>(
    res: Response,
    data: T | null = null,
    message = 'Success',
    statusCode = 200,
    pagination?: ApiResponse['pagination']
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data: data ?? (undefined as T | undefined),
      statusCode,
      timestamp: new Date().toISOString(),
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   */
  static error(
    res: Response,
    message = 'Error',
    statusCode = 500,
    error: string | undefined = undefined
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Alias for success – backward-compat with previous sendSuccess export
   */
  static sendSuccess<T>(
    res: Response,
    data: T | null = null,
    message = 'Success',
    statusCode = 200,
    pagination?: ApiResponse['pagination']
  ): Response {
    return ResponseFormatter.success(res, data, message, statusCode, pagination);
  }

  /**
   * Alias for error – backward-compat with previous sendError export
   */
  static sendError(
    res: Response,
    message = 'Error',
    statusCode = 500,
    error: string | undefined = undefined
  ): Response {
    return ResponseFormatter.error(res, message, statusCode, error);
  }

  /**
   * Paginated response
   */
  static paginated<T>(
    res: Response,
    data: T,
    page: number,
    limit: number,
    total: number,
    message = 'Success'
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode: 200,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Pagination helper
   */
  static getPagination(page = 1, limit = 10) {
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    return {
      skip,
      limit: safeLimit,
    };
  }

  /**
   * Validation error response
   */
  static sendValidationError(
    res: Response,
    errors: unknown,
    message = 'Validation failed'
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: errors instanceof Error ? errors.message : String(errors),
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };

    return res.status(400).json(response);
  }
}

export default ResponseFormatter;
