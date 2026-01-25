import { Router } from 'express';
// import { protect } from '../auth/auth.middleware.js'; // Assuming this exists
// Mock auth middleware if not ready
import { initiatePayment, handleWebhook } from './payment.controller.js';

const router = Router();

// Webhook must be raw body usually, but standard express.json is fine for mock
router.post('/webhook', handleWebhook);

// Protected routes
// router.use(protect);
router.post('/', initiatePayment);

export const paymentRouter = router;
