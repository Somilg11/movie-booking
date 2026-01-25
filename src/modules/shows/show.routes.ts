import { Router } from 'express';
import { createShow, getShowsByMovie, getShowsByTheatre } from './show.controller.js';
// import { protect, restrictTo } from '../auth/auth.middleware.js'; 

const router = Router();

// Public
router.get('/movie/:movieId', getShowsByMovie);
router.get('/theatre/:theatreId', getShowsByTheatre);

// Protected (Admin/Client)
// router.use(protect);
router.post('/', createShow);

export const showRouter = router;
