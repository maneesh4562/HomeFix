import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  paymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  bookingId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'usd'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema); 