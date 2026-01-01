import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/asyncHandler.js';
import { validateParams } from '../../common/middleware/validate.js';
import { objectIdSchema } from '../../common/utils/objectId.js';
import { authenticate, requireRole } from '../auth/auth.middleware.js';
import { UserRole } from '../users/user.types.js';
import { approveClient, rejectClient } from './admin.controller.js';
import { z } from 'zod';

const paramsSchema = z.object({
  clientId: objectIdSchema
});

export const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(requireRole(UserRole.ROOT_ADMIN, UserRole.SYSTEM_ADMIN));

adminRouter.patch('/clients/:clientId/approve', validateParams(paramsSchema), asyncHandler(approveClient));
adminRouter.patch('/clients/:clientId/reject', validateParams(paramsSchema), asyncHandler(rejectClient));
