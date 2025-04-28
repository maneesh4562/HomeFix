import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Payment } from '../models/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const payment = new Payment({
      userId: req.user?.id,
      bookingId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'completed',
      paymentIntentId
    });

    await payment.save();
    res.json(payment);
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ userId: req.user?.id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
}; 