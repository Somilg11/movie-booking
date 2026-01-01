import { z } from 'zod';
import bcrypt from 'bcrypt';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password too long');

export async function hashPassword(password: string, saltRounds: number): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
