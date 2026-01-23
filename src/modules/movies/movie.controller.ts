import type { RequestHandler } from 'express';
import { movieService } from './movie.service.js';
import { createMovieSchema, updateMovieSchema, movieQuerySchema } from './movie.schema.js';

export const createMovie: RequestHandler = async (req, res, next) => {
    try {
        const input = createMovieSchema.parse(req.body);
        const movie = await movieService.create(input);
        return res.status(201).json({ movie });
    } catch (err: any) {
        if (err.message === 'Movie with this name and language already exists') {
            return res.status(409).json({ message: err.message });
        }
        next(err);
    }
};

export const getMovies: RequestHandler = async (req, res, next) => {
    try {
        const query = movieQuerySchema.parse(req.query);
        const { movies, total } = await movieService.findAll(query);

        return res.json({
            movies,
            meta: {
                total,
                page: query.page,
                limit: query.limit,
                pages: Math.ceil(total / query.limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getMovie: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const movie = await movieService.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.json({ movie });
    } catch (err) {
        next(err);
    }
};

export const updateMovie: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const input = updateMovieSchema.parse(req.body);

        const movie = await movieService.update(id, input);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        return res.json({ movie });
    } catch (err) {
        next(err);
    }
};

export const deleteMovie: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const result = await movieService.delete(id);
        if (!result) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
        next(err);
    }
};
