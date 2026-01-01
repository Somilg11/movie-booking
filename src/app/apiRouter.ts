import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { adminRouter } from '../modules/admin/admin.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
