import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model.js';
import { AppError } from '../../common/utils/AppError.js';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        // Filter out unwanted fields (like role, password)
        const allowedUpdates = ['name', 'phone', 'avatar']; // Example fields
        const updates: any = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await UserModel.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};
