import { TheatreModel, type ITheatre } from './theatre.model.js';
import type { CreateTheatreInput, TheatreQueryInput, UpdateTheatreInput, AddMovieToTheatreInput } from './theatre.schema.js';
import type { AuthUser } from '../auth/auth.middleware.js';
import { UserRole, ClientStatus } from '../users/user.types.js';
import { UserModel } from '../users/user.model.js';
import mongoose, { type SortOrder } from 'mongoose';

export class TheatreService {

    private checkOwnership(user: AuthUser, theatre: ITheatre): boolean {
        if (user.role === UserRole.ROOT_ADMIN || user.role === UserRole.SYSTEM_ADMIN) return true;
        return String(theatre.ownerId) === String(user.id);
    }

    async create(input: CreateTheatreInput, user: AuthUser): Promise<ITheatre> {
        if (user.role === UserRole.CLIENT) {
            const dbUser = await UserModel.findById(user.id);
            if (dbUser?.clientStatus !== ClientStatus.APPROVED) {
                throw new Error('Client account not approved');
            }
        }

        const theatre = await TheatreModel.create({
            ...input,
            ownerId: user.id
        });
        return theatre;
    }

    async findAll(query: TheatreQueryInput): Promise<{ theatres: ITheatre[]; total: number }> {
        const { page, limit, city, pin, movieId } = query;
        const filter: any = {};
        if (city) filter.city = { $regex: city, $options: 'i' };
        if (pin) filter.pin = pin;
        if (movieId) {
            filter['movies.movieId'] = movieId;
        }

        const skip = (page - 1) * limit;
        const [theatres, total] = await Promise.all([
            TheatreModel.find(filter).skip(skip).limit(limit),
            TheatreModel.countDocuments(filter)
        ]);

        return { theatres, total };
    }

    async findById(id: string): Promise<ITheatre | null> {
        return TheatreModel.findById(id).populate('movies.movieId', 'name posterUrl language genres');
    }

    async update(id: string, input: UpdateTheatreInput, user: AuthUser): Promise<ITheatre | null> {
        const theatre = await TheatreModel.findById(id);
        if (!theatre) return null;

        if (!this.checkOwnership(user, theatre)) {
            throw new Error('Forbidden');
        }

        Object.assign(theatre, input);
        await theatre.save();
        return theatre;
    }

    async delete(id: string, user: AuthUser): Promise<boolean> {
        const theatre = await TheatreModel.findById(id);
        if (!theatre) return false;

        if (!this.checkOwnership(user, theatre)) {
            throw new Error('Forbidden');
        }

        await theatre.deleteOne();
        return true;
    }

    async addMovie(id: string, input: AddMovieToTheatreInput, user: AuthUser): Promise<ITheatre | null> {
        const theatre = await TheatreModel.findById(id);
        if (!theatre) return null;

        if (!this.checkOwnership(user, theatre)) {
            throw new Error('Forbidden');
        }

        // Remove existing if any
        theatre.movies = theatre.movies.filter(m => String(m.movieId) !== input.movieId);

        const shows = input.showTimes.map(t => ({ time: new Date(t) }));
        theatre.movies.push({
            movieId: input.movieId as any,
            price: input.price,
            shows
        });

        await theatre.save();
        return theatre;
    }

    async removeMovie(id: string, movieId: string, user: AuthUser): Promise<boolean> {
        const theatre = await TheatreModel.findById(id);
        if (!theatre) return false; // or throw not found

        if (!this.checkOwnership(user, theatre)) {
            throw new Error('Forbidden');
        }

        const originalLength = theatre.movies.length;
        theatre.movies = theatre.movies.filter(m => String(m.movieId) !== movieId);

        // We can save even if no movie was removed, to be idempotent
        await theatre.save();
        return true;
    }
}

export const theatreService = new TheatreService();
