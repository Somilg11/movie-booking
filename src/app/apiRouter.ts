import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { adminRouter } from '../modules/admin/admin.routes.js';
import { movieRouter } from '../modules/movies/movie.routes.js';
import { theatreRouter } from '../modules/theatres/theatre.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/movies', movieRouter);
apiRouter.use('/theatres', theatreRouter);
