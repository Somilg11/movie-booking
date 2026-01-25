import { Router } from 'express';
import { createBooking, cancelBooking, listBookings } from './booking.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createBooking);
router.get('/', listBookings);
router.patch('/:id/cancel', cancelBooking);

export const bookingRouter = router;
