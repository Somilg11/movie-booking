import mongoose, { type InferSchemaType } from 'mongoose';

const screenSeatMapSchema = new mongoose.Schema(
  {
    rows: { type: Number, required: true, min: 1 },
    cols: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const theatreMovieSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    showTimes: { type: [Date], default: [] },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, index: true },
    pin: { type: String, required: true, index: true },
    address: { type: String, required: true },

    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    screens: { type: Number, required: true, min: 1 },
    seatMap: { type: Map, of: screenSeatMapSchema, default: {} },

    movies: { type: [theatreMovieSchema], default: [] }
  },
  { timestamps: true }
);

theatreSchema.index({ city: 1, pin: 1 });

type TheatreDoc = InferSchemaType<typeof theatreSchema> & { _id: mongoose.Types.ObjectId };

export const TheatreModel = mongoose.model<TheatreDoc>('Theatre', theatreSchema);
