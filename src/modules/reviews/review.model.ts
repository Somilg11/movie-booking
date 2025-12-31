import mongoose, { type InferSchemaType } from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

export type ReviewDoc = InferSchemaType<typeof reviewSchema> & { _id: mongoose.Types.ObjectId };

export const ReviewModel = mongoose.model('Review', reviewSchema);
