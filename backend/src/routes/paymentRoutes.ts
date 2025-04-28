import express from 'express';
import { auth } from '../middleware/auth';
import { createPaymentIntent, confirmPayment, getPaymentHistory } from '../controllers/paymentController';

const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', auth, createPaymentIntent);

// Confirm a payment
router.post('/confirm', auth, confirmPayment);

// Get payment history
router.get('/history', auth, getPaymentHistory);

export default router; 