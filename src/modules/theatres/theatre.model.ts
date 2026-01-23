import mongoose from 'mongoose';

// Sub-schema for mapping movies (Shows)
// A simple approach: list of movies currently running, with their showtimes
const showSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  totalSeats: { type: Number, required: false }, // optional if derived from screen
  availableSeats: { type: Number, required: false } // naive inventory cache
}, { _id: false });

const theatreMovieSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  price: { type: Number, required: true },
  shows: [showSchema]
}, { _id: false });

export interface ITheatre {
  name: string;
  city: string;
  pin: string;
  address: string;
  screens: number;
  seatMap: Record<string, any>; // Flexible for now
  ownerId: mongoose.Types.ObjectId;
  movies: {
    movieId: mongoose.Types.ObjectId;
    price: number;
    shows: { time: Date }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const theatreSchema = new mongoose.Schema<ITheatre>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    pin: { type: String, required: true, index: true },
    address: { type: String, required: true },
    screens: { type: Number, required: true, default: 1 },
    seatMap: { type: Map, of: mongoose.Schema.Types.Mixed }, // flexible
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movies: [theatreMovieSchema] // Embedded approach simple for v1
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const TheatreModel = mongoose.model<ITheatre>('Theatre', theatreSchema);
