import type { RequestHandler } from 'express';

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Express does NOT automatically catch errors thrown inside async/await route handlers. 
// It ensures any error inside an async route is forwarded to Express’s error middleware.

// Promise.resolve()? Because it handles both cases safely:
// async (req, res) => { ... }  // returns Promise
// (req, res) => { ... }        // returns void

// throw → Promise.reject → next(err)
//    ↓
// errorHandler()
//    ↓
// log + response

