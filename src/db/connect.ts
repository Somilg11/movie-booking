import mongoose from 'mongoose';
import { logger } from '../common/utils/logger.js';

export async function connectDb(mongoUrl: string): Promise<void> {
  // strictQuery: true -> Unknown fields are ignored, Prevents accidental / insecure queries
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUrl);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    // log error and re-throw error so that : bootstrap().catch(() => process.exit(1)); handles it
    logger.error({ error }, 'Error connecting to MongoDB');
    throw error;
  }
}
