import { z } from 'zod';
import { ClientStatus, UserRole } from './user.types.js';
import { passwordSchema } from '../../common/utils/password.js';

export const userRoleSchema = z.nativeEnum(UserRole);
export const clientStatusSchema = z.nativeEnum(ClientStatus);

export const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: passwordSchema,
  role: userRoleSchema.optional()
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
