import mongoose, { type InferSchemaType } from 'mongoose';

const showSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
        theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },

        // e.g. "Screen 1"
        screenName: { type: String, required: true },

        startTime: { type: Date, required: true, index: true },
        endTime: { type: Date, required: true },

        price: { type: Number, required: true, min: 0 },

        totalSeats: { type: Number, required: true },
        availableSeats: { type: Number, required: true },

        // Optional: track booked seats map here if not using separate Booking table query for availability
        // bookedSeatNumbers: { type: [String], default: [] }
    },
    { timestamps: true }
);

showSchema.index({ theatreId: 1, startTime: 1 });

export type ShowDoc = InferSchemaType<typeof showSchema> & { _id: mongoose.Types.ObjectId };

export const ShowModel = mongoose.model('Show', showSchema);
