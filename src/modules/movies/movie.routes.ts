import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/asyncHandler.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { UserRole } from '../users/user.types.js';
import {
    createMovie,
    getMovies,
    getMovie,
    updateMovie,
    deleteMovie
} from './movie.controller.js'; // Note: importing from .js as per ESM in TS

export const movieRouter = Router();

// Public routes
movieRouter.get('/', asyncHandler(getMovies));
movieRouter.get('/:id', asyncHandler(getMovie));

// Protected Admin routes
// Both SYSTEM_ADMIN and ROOT_ADMIN can manage movies
const adminRoles = [UserRole.SYSTEM_ADMIN, UserRole.ROOT_ADMIN];

movieRouter.post('/', authenticate, authorize(adminRoles), asyncHandler(createMovie));
movieRouter.put('/:id', authenticate, authorize(adminRoles), asyncHandler(updateMovie));
movieRouter.delete('/:id', authenticate, authorize(adminRoles), asyncHandler(deleteMovie));
