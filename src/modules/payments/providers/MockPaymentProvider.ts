import { IPaymentProvider, PaymentResult } from '../../../common/interfaces/IPaymentProvider.js';
import { v4 as uuidv4 } from 'uuid';

export class MockPaymentProvider implements IPaymentProvider {
    async initiatePayment(amount: number, currency: string, metadata: any): Promise<{ paymentId: string; clientSecret?: string }> {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            paymentId: uuidv4(),
            clientSecret: 'mock_client_secret_' + uuidv4(),
        };
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate success
        return {
            success: true,
            transactionId: uuidv4(),
            amount: 100, // In real scenario fetch from provider
            currency: 'USD',
            provider: 'mock',
            metadata: {},
        };
    }

    async handleWebhook(payload: any, signature: string): Promise<PaymentResult> {
        // Mock webhook verification
        return {
            success: true,
            transactionId: payload.data?.id || uuidv4(),
            amount: payload.data?.amount || 0,
            currency: 'USD',
            provider: 'mock',
        };
    }
}
