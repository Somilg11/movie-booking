import type { RequestHandler } from 'express';
import type { z } from 'zod';

export type ZodSchema<T> = z.ZodType<T>;

type ValidatedLocals = {
  validated?: {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };
};

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    // parse throws ZodError which our global error handler converts to 400
    (req as any).locals = (req as any).locals ?? {};
    ((req as any).locals as ValidatedLocals).validated = {
      ...(((req as any).locals as ValidatedLocals).validated ?? {}),
      body: schema.parse(req.body)
    };
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    (req as any).locals = (req as any).locals ?? {};
    ((req as any).locals as ValidatedLocals).validated = {
      ...(((req as any).locals as ValidatedLocals).validated ?? {}),
      query: schema.parse(req.query)
    };
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    (req as any).locals = (req as any).locals ?? {};
    ((req as any).locals as ValidatedLocals).validated = {
      ...(((req as any).locals as ValidatedLocals).validated ?? {}),
      params: schema.parse(req.params)
    };
    next();
  };
}
