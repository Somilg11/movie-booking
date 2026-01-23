import type { RequestHandler } from 'express';
import { theatreService } from './theatre.service.js';
import {
    createTheatreSchema,
    updateTheatreSchema,
    theatreQuerySchema,
    addMovieToTheatreSchema
} from './theatre.schema.js';

export const createTheatre: RequestHandler = async (req, res, next) => {
    try {
        const user = req.auth!;
        const input = createTheatreSchema.parse(req.body);
        const theatre = await theatreService.create(input, user);
        return res.status(201).json({ theatre });
    } catch (err: any) {
        if (err.message === 'Client account not approved') {
            return res.status(403).json({ message: err.message });
        }
        next(err);
    }
};

export const getTheatres: RequestHandler = async (req, res, next) => {
    try {
        const query = theatreQuerySchema.parse(req.query);
        const { theatres, total } = await theatreService.findAll(query);

        return res.json({
            theatres,
            meta: { total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) }
        });
    } catch (err) {
        next(err);
    }
};

export const getTheatre: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const theatre = await theatreService.findById(id);

        if (!theatre) return res.status(404).json({ message: 'Theatre not found' });

        return res.json({ theatre });
    } catch (err) {
        next(err);
    }
};

export const updateTheatre: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const input = updateTheatreSchema.parse(req.body);

        const theatre = await theatreService.update(id, input, req.auth!); // req.auth is guaranteed by authenticate

        if (!theatre) return res.status(404).json({ message: 'Theatre not found' }); // or forbidden handled by service throwing

        return res.json({ theatre });
    } catch (err: any) {
        if (err.message === 'Forbidden') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next(err);
    }
};

export const deleteTheatre: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const result = await theatreService.delete(id, req.auth!);

        if (!result) return res.status(404).json({ message: 'Theatre not found' });

        return res.json({ message: 'Theatre deleted' });
    } catch (err: any) {
        if (err.message === 'Forbidden') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next(err);
    }
};

// --- Movie Mapping ---

export const addMovieToTheatre: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const input = addMovieToTheatreSchema.parse(req.body);

        const theatre = await theatreService.addMovie(id, input, req.auth!);

        if (!theatre) return res.status(404).json({ message: 'Theatre not found' });

        return res.json({ message: 'Movie added to theatre', theatre });
    } catch (err: any) {
        if (err.message === 'Forbidden') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next(err);
    }
};

export const removeMovieFromTheatre: RequestHandler = async (req, res, next) => {
    try {
        const { id, movieId } = req.params as { id: string, movieId: string };
        const result = await theatreService.removeMovie(id, movieId, req.auth!);

        if (!result) return res.status(404).json({ message: 'Theatre not found' });

        return res.json({ message: 'Movie removed from theatre' });
    } catch (err: any) {
        if (err.message === 'Forbidden') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next(err);
    }
};

export const getTheatreMovies: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params as { id: string };
        const theatre = await theatreService.findById(id);
        if (!theatre) return res.status(404).json({ message: 'Theatre not found' });

        return res.json({ movies: theatre.movies });
    } catch (err) {
        next(err);
    }
};
