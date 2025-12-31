import express from 'express';
import { errorHandler } from '../common/middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // TODO: mount routers under /mba/api/v1
  // app.use('/mba/api/v1', apiRouter);

  // last
  app.use(errorHandler);

  return app;
}
