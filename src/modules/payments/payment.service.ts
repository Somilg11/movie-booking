import { PaymentModel, PaymentDoc } from './payment.model.js';
import { IPaymentProvider } from '../../common/interfaces/IPaymentProvider.js';
import { MockPaymentProvider } from './providers/MockPaymentProvider.js';
import { AppError } from '../../common/utils/AppError.js';
import { PaymentStatus } from './payment.types.js';
import { logger } from '../../common/utils/logger.js';
import { BookingModel } from '../bookings/booking.model.js'; // Assuming this exists or will exist

class PaymentService {
    private provider: IPaymentProvider;

    constructor(provider: IPaymentProvider) {
        this.provider = provider;
    }

    async initiatePayment(
        userId: string,
        bookingId: string,
        amount: number,
        currency = 'USD'
    ): Promise<{ payment: PaymentDoc; clientSecret?: string }> {
        // 1. Check if booking exists and is pending
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        // TODO: Check booking status (must be PENDING or RESERVED)

        // 2. Create Payment Record (Pending)
        const payment = await PaymentModel.create({
            bookingId,
            userId,
            amount,
            currency,
            provider: 'mock', // Should be dynamic based on provider
            status: PaymentStatus.INITIATED,
        });

        // 3. Call Provider
        try {
            const { paymentId, clientSecret } = await this.provider.initiatePayment(amount, currency, {
                paymentId: payment._id.toString(),
                bookingId,
            });

            // 4. Update Payment with provider ref
            payment.providerRef = paymentId;
            await payment.save();

            return { payment, ...(clientSecret ? { clientSecret } : {}) };
        } catch (error) {
            payment.status = PaymentStatus.FAILED;
            await payment.save();
            logger.error({ err: error }, 'Payment initiation failed');
            throw new AppError('Payment initiation failed', 500);
        }
    }

    async handleWebhook(payload: any, signature: string) {
        // 1. Verify with provider
        const result = await this.provider.handleWebhook(payload, signature);

        if (!result.success) {
            throw new AppError('Invalid webhook signature or payload', 400);
        }

        // 2. Find payment
        // In a real scenario, we'd lookup by providerRef. 
        // For mock, we might pass internal ID in metadata or use transactionId map.
        // Here assuming transactionId corresponds to providerRef or we lookup by bookingId if passed.

        // For simplicity in this mock:
        // We assume the verified result contains enough info to find the payment or we passed our ID.
        // In MockProvider, we returned transactionId. 
        // Let's assume we find payment by providerRef = result.transactionId

        // NOTE: In production, better to pass our internal paymentId in metadata to provider and get it back.

        const payment = await PaymentModel.findOne({ providerRef: result.transactionId });
        if (!payment) {
            logger.warn(`Payment not found for providerRef: ${result.transactionId}`);
            // Consider returning 200 to provider to stop retries if it's a "not found" issue?
            // Or throw to retry.
            throw new AppError('Payment record not found', 404);
        }

        // 3. Update Payment Status
        if (result.success) {
            payment.status = PaymentStatus.SUCCESS;
            await payment.save();

            // 4. Update Booking Status -> CONFIRMED
            // await BookingService.confirmBooking(payment.bookingId); 
            // Direct update for now to avoid circular dependency hell, ideally use Service or EventBus
            await BookingModel.findByIdAndUpdate(payment.bookingId, { status: 'CONFIRMED' });
        } else {
            payment.status = PaymentStatus.FAILED;
            await payment.save();
            // Update booking to CANCELLED or PAYMENT_FAILED?
        }

        return { received: true };
    }
}

// Singleton with Mock Provider for now
export const paymentService = new PaymentService(new MockPaymentProvider());
