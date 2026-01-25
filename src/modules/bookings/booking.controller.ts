import { Request, Response, NextFunction } from 'express';
import { bookingService } from './booking.service.js';
import { AppError } from '../../common/utils/AppError.js';
import { UserRole } from '../users/user.types.js';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return next(new AppError('User not authenticated', 401));
        }

        const { showId, seats } = req.body;
        if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
            return next(new AppError('Please provide showId and seats', 400));
        }

        const booking = await bookingService.createBooking(userId, showId, seats);

        res.status(201).json({
            status: 'success',
            data: { booking }
        });
    } catch (err) {
        next(err);
    }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const role = (req as any).user?.role;

        // Admin or Owner check handled in Service mostly, passing role/admin flag
        const isAdmin = role === UserRole.ROOT_ADMIN || role === UserRole.SYSTEM_ADMIN;

        const booking = await bookingService.cancelBooking(id || '', userId!, isAdmin);

        res.status(200).json({
            status: 'success',
            data: { booking }
        });
    } catch (err) {
        next(err);
    }
};

export const listBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const role = (req as any).user?.role;

        const bookings = await bookingService.listBookings(userId!, role!);

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    } catch (err) {
        next(err);
    }
};
