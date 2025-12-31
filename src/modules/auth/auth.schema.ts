import { z } from 'zod';
import { passwordSchema } from '../../common/utils/password.js';

/**
 * Auth schemas are separated from user schemas to keep a clean boundary:
 * - users module owns User entity shape
 * - auth module owns credentials + tokens + role-specific registration flows
 */

export const customerSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: passwordSchema
});

export const clientSignupSchema = z.object({
  ownerName: z.string().min(1),
  companyName: z.string().min(1),
  email: z.string().email(),
  password: passwordSchema,
  phone: z.string().min(5).max(40)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// JWT payload shape (minimal). Extend as needed.
export const accessTokenPayloadSchema = z.object({
  sub: z.string().min(1),
  role: z.string().min(1)
});

export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;
export type ClientSignupInput = z.infer<typeof clientSignupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
