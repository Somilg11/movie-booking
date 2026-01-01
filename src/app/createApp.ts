import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from '../common/middleware/errorHandler.js';
import { apiRouter } from './apiRouter.js';

export function createApp() {
  const app = express();

  // Security hardening (sane defaults)
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 200,
      standardHeaders: 'draft-7',
      legacyHeaders: false
    })
  );

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Versioned API
  app.use('/mba/api/v1', apiRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // last
  app.use(errorHandler);

  return app;
}
