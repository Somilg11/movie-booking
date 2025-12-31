import mongoose, { type InferSchemaType } from 'mongoose';
import { PaymentStatus } from './payment.types.js';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    provider: { type: String, required: true },
    providerRef: { type: String },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.INITIATED,
      index: true
    }
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1, status: 1 });

export type PaymentDoc = InferSchemaType<typeof paymentSchema> & { _id: mongoose.Types.ObjectId };

export const PaymentModel = mongoose.model('Payment', paymentSchema);
