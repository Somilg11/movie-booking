import { z } from 'zod';

const seatSchema = z.object({
    id: z.string(), // e.g. "A1"
    type: z.string().default('standard'), // standard, premium, etc.
    status: z.enum(['AVAILABLE', 'BOOKED', 'LOCKED']).default('AVAILABLE')
});

const rowSchema = z.object({
    rowName: z.string(), // "A"
    seats: z.array(seatSchema)
});

// For simplicity, we can just store dimensions and auto-generate, or store full map.
// Let's store a flexible map object for now, or just row/col counts.
// Implementing a simple row/col based structure as per prompt example.
const screenConfigSchema = z.object({
    rows: z.number().int().min(1),
    cols: z.number().int().min(1),
    aisles: z.array(z.number()).optional() // column indices that are aisles
});

export const createTheatreSchema = z.object({
    name: z.string().min(1),
    city: z.string().min(1),
    pin: z.string().length(6), // Assuming 6 digit pin code
    address: z.string().min(5),
    screens: z.number().int().min(1),
    seatMap: z.record(z.string(), screenConfigSchema) // "screen1": { rows: 10, cols: 20 }
});

export const updateTheatreSchema = createTheatreSchema.partial();

export const theatreQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    city: z.string().optional(),
    pin: z.string().optional(),
    movieId: z.string().optional() // to find theatres showing a movie
});

export const addMovieToTheatreSchema = z.object({
    movieId: z.string().min(1),
    showTimes: z.array(z.string().datetime()).min(1),
    price: z.number().positive()
});

export type CreateTheatreInput = z.infer<typeof createTheatreSchema>;
export type UpdateTheatreInput = z.infer<typeof updateTheatreSchema>;
export type TheatreQueryInput = z.infer<typeof theatreQuerySchema>;
export type AddMovieToTheatreInput = z.infer<typeof addMovieToTheatreSchema>;
