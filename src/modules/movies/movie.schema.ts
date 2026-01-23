import { z } from 'zod';

export const createMovieSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  durationMins: z.number().int().positive('Duration must be positive'),
  language: z.string().min(2),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  releaseDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // ISO or YYYY-MM-DD
  posterUrl: z.string().url().optional(),
  trailerUrl: z.string().url().optional()
});

export const updateMovieSchema = createMovieSchema.partial();

export const movieQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(), // search by name
  genre: z.string().optional(),
  language: z.string().optional(),
  sort: z.enum(['releaseDate', 'name', 'durationMins']).optional()
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type MovieQueryInput = z.infer<typeof movieQuerySchema>;
