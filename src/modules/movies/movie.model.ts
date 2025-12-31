import mongoose, { type InferSchemaType } from 'mongoose';
import { MovieReleaseStatus } from './movie.types.js';

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    casts: { type: [String], required: true },
    trailerUrl: { type: String, required: true },
    language: { type: String, required: true, default: 'English', index: true },
    releaseDate: { type: Date, required: true, index: true },
    director: { type: String, required: true },
    releaseStatus: {
      type: String,
      required: true,
      enum: Object.values(MovieReleaseStatus),
      default: MovieReleaseStatus.COMING_SOON,
      index: true
    }
  },
  { timestamps: true }
);

movieSchema.index({ name: 1 });

export type MovieDoc = InferSchemaType<typeof movieSchema> & { _id: mongoose.Types.ObjectId };

export const MovieModel = mongoose.model('Movie', movieSchema);
