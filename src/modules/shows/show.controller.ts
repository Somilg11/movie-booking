import { Request, Response, NextFunction } from 'express';
import { ShowModel } from './show.model.js';
import { AppError } from '../../common/utils/AppError.js';

export const createShow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieId, theatreId, screenName, startTime, endTime, price, totalSeats } = req.body;

        // TODO: Validate if theatre belongs to Client (if Client role)
        // TODO: Validate overlapping shows on same screen

        const show = await ShowModel.create({
            movieId,
            theatreId,
            screenName,
            startTime,
            endTime,
            price,
            totalSeats,
            availableSeats: totalSeats // Initially all available
        });

        res.status(201).json({
            status: 'success',
            data: { show }
        });
    } catch (err) {
        next(err);
    }
};

export const getShowsByMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieId } = req.params;
        const shows = await ShowModel.find({ movieId: movieId as string }).populate('theatreId');

        res.status(200).json({
            status: 'success',
            data: { shows }
        });
    } catch (err) {
        next(err);
    }
};

export const getShowsByTheatre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { theatreId } = req.params;
        const shows = await ShowModel.find({ theatreId: theatreId as string }).populate('movieId');

        res.status(200).json({
            status: 'success',
            data: { shows }
        });
    } catch (err) {
        next(err);
    }
};
