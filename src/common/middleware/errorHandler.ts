import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      issues: err.issues
    });
  }

  const status = typeof err?.statusCode === 'number' ? err.statusCode : 500;

  logger.error({ err }, 'Unhandled error');

  return res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message ?? 'Error'
  });
};


// This middleware:
// 1: Catches errors from routes
// 2: Formats the response
// 3: Logs the error
// 4: Prevents app crashes


// Route handler
//    ↓
// asyncHandler
//    ↓
// errorHandler
//    ↓
// client response
