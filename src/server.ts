import 'dotenv/config';

import { createApp } from './app/createApp.js';
import { connectDb } from './db/connect.js';
import { getEnv } from './config/env.js';
import { logger } from './common/utils/logger.js';

const env = getEnv();

async function bootstrap() {
  await connectDb(env.MONGODB_URL);

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on http://localhost:${env.PORT}`);
  });

  // Graceful shutdown function
  const shutdown = (signal: string) => {
    logger.info({ signal }, 'Shutting down');
    server.close(() => {
      process.exit(0);
    });
  };

  // Handle termination OS signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});

// Load env vars
//    ↓
// Connect to database
//    ↓
// Create app
//    ↓
// Start HTTP server
//    ↓
// Listen for shutdown signals

