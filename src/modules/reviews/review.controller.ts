import { Request, Response, NextFunction } from 'express';
// import { ReviewModel } from './review.model.js'; // Assuming it exists
import { AppError } from '../../common/utils/AppError.js';
// Temporary shim if model not found yet
import mongoose from 'mongoose';

// Ensure ReviewModel import is correct after viewing file. 
// Assuming standard export naming from previous patterns.
import { ReviewModel } from './review.model.js';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const { movieId } = req.params;
        const { rating, comment } = req.body;

        // Check if review already exists
        // @ts-ignore
        const existingReview = await ReviewModel.findOne({ userId, movieId });
        if (existingReview) {
            return next(new AppError('You have already reviewed this movie', 400));
        }

        const review = await ReviewModel.create({
            userId,
            movieId: movieId as string, // Cast for Mongoose
            rating,
            comment
        });

        res.status(201).json({
            status: 'success',
            data: { review }
        });
    } catch (err) {
        next(err);
    }
};

export const getMovieReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieId } = req.params;
        // @ts-ignore
        const reviews = await ReviewModel.find({ movieId }).populate('userId', 'name');

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: { reviews }
        });
    } catch (err) {
        next(err);
    }
};
