import { createHash } from 'node:crypto';

// For refresh tokens, store only a hash in DB.
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}
