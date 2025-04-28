import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  createPaymentIntent,
  addReview,
} from '../controllers/bookingController';
import { auth } from '../middleware/auth';

const router = Router();

// Protected routes
router.post('/', auth, createBooking);
router.get('/', auth, getBookings);
router.get('/:id', auth, getBookingById);
router.patch('/:id/status', auth, updateBookingStatus);
router.post('/:id/review', auth, addReview);
router.post('/payment-intent', auth, createPaymentIntent);

export default router; 