import mongoose from 'mongoose';

export interface IMovie {
  name: string;
  description?: string;
  durationMins: number;
  language: string;
  genres: string[];
  releaseDate: Date;
  posterUrl?: string;
  trailerUrl?: string;
  slug: string; // for SEO friendly URLs if needed, or just internal uniqueness
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new mongoose.Schema<IMovie>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    durationMins: { type: Number, required: true },
    language: { type: String, required: true, index: true },
    genres: { type: [String], required: true, index: true },
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String },
    trailerUrl: { type: String },
    slug: { type: String, unique: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Pre-save hook to generate slug if not present
movieSchema.pre('save', function (this: mongoose.HydratedDocument<IMovie>) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export const MovieModel = mongoose.model<IMovie>('Movie', movieSchema);
