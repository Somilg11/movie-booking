import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { adminRouter } from '../modules/admin/admin.routes.js';
import { movieRouter } from '../modules/movies/movie.routes.js';
import { theatreRouter } from '../modules/theatres/theatre.routes.js';
import { bookingRouter } from '../modules/bookings/booking.routes.js';
import { paymentRouter } from '../modules/payments/payment.routes.js';
import { reviewRouter } from '../modules/reviews/review.routes.js';
import { showRouter } from '../modules/shows/show.routes.js';
import { userRouter } from '../modules/users/user.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/movies', movieRouter);
apiRouter.use('/theatres', theatreRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/shows', showRouter);
apiRouter.use('/users', userRouter);
