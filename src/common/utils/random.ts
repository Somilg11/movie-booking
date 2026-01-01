import { randomBytes } from 'node:crypto';

export function randomId(bytes = 16): string {
  return randomBytes(bytes).toString('hex');
}
