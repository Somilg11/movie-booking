import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service.js';
import { AppError } from '../../common/utils/AppError.js';

export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id; // Assuming auth middleware populates this
        const { bookingId, amount, currency } = req.body;

        if (!userId) {
            return next(new AppError('User not authenticated', 401));
        }

        if (!bookingId || !amount) {
            return next(new AppError('Please provide bookingId and amount', 400));
        }

        const result = await paymentService.initiatePayment(userId, bookingId, amount, currency);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signature = req.headers['stripe-signature'] as string || ''; // Example
        await paymentService.handleWebhook(req.body, signature);

        res.status(200).json({ received: true });
    } catch (err) {
        next(err);
    }
};
