import { Router } from 'express';
import { getMe, updateMe } from './user.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', updateMe);

export const userRouter = router;
