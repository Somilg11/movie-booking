import mongoose, { type SortOrder } from 'mongoose';
import { MovieModel, type IMovie } from './movie.model.js';
import type { CreateMovieInput, MovieQueryInput, UpdateMovieInput } from './movie.schema.js';

export class MovieService {
    /**
     * Create a new movie
     */
    async create(input: CreateMovieInput): Promise<IMovie> {
        // Check for duplicates
        const existing = await MovieModel.findOne({
            name: input.name,
            language: input.language
        });

        if (existing) {
            throw new Error('Movie with this name and language already exists');
        }

        const movie = await MovieModel.create({
            name: input.name,
            durationMins: input.durationMins,
            language: input.language,
            genres: input.genres,
            releaseDate: new Date(input.releaseDate),
            ...(input.description ? { description: input.description } : {}),
            ...(input.posterUrl ? { posterUrl: input.posterUrl } : {}),
            ...(input.trailerUrl ? { trailerUrl: input.trailerUrl } : {})
        });

        return movie;
    }

    /**
     * Find movies with filters and pagination
     */
    async findAll(query: MovieQueryInput): Promise<{ movies: IMovie[]; total: number }> {
        const { page, limit, search, genre, language, sort } = query;

        const filter: any = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (genre) {
            filter.genres = genre;
        }
        if (language) {
            filter.language = language;
        }

        const sortOptions: { [key: string]: SortOrder } = {};
        if (sort) {
            sortOptions[sort] = 1; // Default asc
        } else {
            sortOptions.createdAt = -1; // Default recent first
        }

        const skip = (page - 1) * limit;

        const [movies, total] = await Promise.all([
            MovieModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
            MovieModel.countDocuments(filter)
        ]);

        return { movies, total };
    }

    /**
     * Find a movie by ID
     */
    async findById(id: string): Promise<IMovie | null> {
        return MovieModel.findById(id);
    }

    /**
     * Update a movie
     */
    async update(id: string, input: UpdateMovieInput): Promise<IMovie | null> {
        const movie = await MovieModel.findByIdAndUpdate(id, { $set: input }, { new: true });
        return movie;
    }

    /**
     * Delete a movie
     */
    async delete(id: string): Promise<IMovie | null> {
        return MovieModel.findByIdAndDelete(id);
    }
}

export const movieService = new MovieService();
