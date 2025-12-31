import { z } from 'zod';

// MongoDB ObjectId is a 24-char hex string
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');
