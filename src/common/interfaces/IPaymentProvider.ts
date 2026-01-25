export interface PaymentResult {
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    provider: string;
    metadata?: any;
}

export interface IPaymentProvider {
    initiatePayment(amount: number, currency: string, metadata: any): Promise<{ paymentId: string; clientSecret?: string }>;
    verifyPayment(paymentId: string): Promise<PaymentResult>;
    handleWebhook(payload: any, signature: string): Promise<PaymentResult>;
}
