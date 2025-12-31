import mongoose, { type InferSchemaType } from 'mongoose';
import { BookingStatus } from './booking.types.js';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },

    showTime: { type: Date, required: true, index: true },
    seats: { type: [String], required: true },

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: true,
      default: BookingStatus.CREATED,
      index: true
    },

    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },

    cancelledAt: { type: Date },
    cancelReason: { type: String }
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, showTime: 1 });

export type BookingDoc = InferSchemaType<typeof bookingSchema> & { _id: mongoose.Types.ObjectId };

export const BookingModel = mongoose.model('Booking', bookingSchema);
