import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000), // coerce converts it to: 3000 (number)
  MONGODB_URL: z.string().min(1, 'MONGODB_URL is required'),

  // Auth
  JWT_ISSUER: z.string().min(1).default('movie-booking-api'),
  JWT_AUDIENCE: z.string().min(1).default('movie-booking-app'),

  // Use a long random secret in production (>= 32 chars recommended)
  JWT_ACCESS_SECRET: z.string().min(20, 'JWT_ACCESS_SECRET must be at least 20 chars'),
  JWT_REFRESH_SECRET: z.string().min(20, 'JWT_REFRESH_SECRET must be at least 20 chars'),

  // Durations (jsonwebtoken supports strings like "15m", "7d")
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('30d'),

  // Security knobs
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12)
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env); // safeParse returns { success: boolean, data?, error? } for controlled error handling
  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${parsed.error.message}`);
  }
  return parsed.data;
}
