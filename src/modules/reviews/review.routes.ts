import { Router } from 'express';
import { createReview, getMovieReviews } from './review.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router({ mergeParams: true }); // Enable access to :movieId from parent router

router.get('/', getMovieReviews);

router.use(authenticate);
router.post('/', createReview);

export const reviewRouter = router;
