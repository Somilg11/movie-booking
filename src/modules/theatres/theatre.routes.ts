import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/asyncHandler.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { UserRole } from '../users/user.types.js';
import {
    createTheatre,
    getTheatres,
    getTheatre,
    updateTheatre,
    deleteTheatre,
    addMovieToTheatre,
    removeMovieFromTheatre,
    getTheatreMovies
} from './theatre.controller.js';

export const theatreRouter = Router();

const managerRoles = [UserRole.SYSTEM_ADMIN, UserRole.ROOT_ADMIN, UserRole.CLIENT];

// Public
theatreRouter.get('/', asyncHandler(getTheatres));
theatreRouter.get('/:id', asyncHandler(getTheatre));
theatreRouter.get('/:id/movies', asyncHandler(getTheatreMovies));

// Protected
theatreRouter.post('/', authenticate, authorize(managerRoles), asyncHandler(createTheatre));
theatreRouter.put('/:id', authenticate, authorize(managerRoles), asyncHandler(updateTheatre));
theatreRouter.delete('/:id', authenticate, authorize(managerRoles), asyncHandler(deleteTheatre));

// Movie Mapping
theatreRouter.post('/:id/movies', authenticate, authorize(managerRoles), asyncHandler(addMovieToTheatre));
theatreRouter.delete('/:id/movies/:movieId', authenticate, authorize(managerRoles), asyncHandler(removeMovieFromTheatre));
