import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/asyncHandler.js';
import { validateBody } from '../../common/middleware/validate.js';
import { authenticate } from './auth.middleware.js';
import { signupCustomer, signupClient, login, refresh, logout, me } from './auth.controller.js';
import { clientSignupSchema, customerSignupSchema, loginSchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post('/signup', validateBody(customerSignupSchema), asyncHandler(signupCustomer));
authRouter.post('/clients/signup', validateBody(clientSignupSchema), asyncHandler(signupClient));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(login));

authRouter.post('/refresh', asyncHandler(refresh));
authRouter.post('/logout', asyncHandler(logout));
authRouter.get('/me', authenticate, asyncHandler(me));
