import { z } from 'zod';
import { MovieReleaseStatus } from './movie.types.js';

export const movieReleaseStatusSchema = z.nativeEnum(MovieReleaseStatus).default(MovieReleaseStatus.COMING_SOON);

export const movieCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  casts: z.array(z.string().min(1)).min(1),
  trailerUrl: z.string().url(),
  language: z.string().min(1).default('English'),
  releaseDate: z.coerce.date(),
  director: z.string().min(1),
  releaseStatus: movieReleaseStatusSchema
});

export type MovieCreateInput = z.infer<typeof movieCreateSchema>;
