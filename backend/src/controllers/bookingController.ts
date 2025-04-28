import { Request, Response } from 'express';
import { Booking, IBooking } from '../models/Booking';
import { Service } from '../models/Service';
import Stripe from 'stripe';
import { Document, Types } from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { serviceId, date, address, description, emergency } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = new Booking({
      service: serviceId,
      customer: req?.user?.id,
      provider: service.provider,
      date,
      address,
      description,
      price: service.basePrice,
      emergency,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const bookings = await Booking.find(filter)
      .populate('service', 'name basePrice')
      .populate('customer', 'firstName lastName')
      .populate('provider', 'firstName lastName')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name basePrice')
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('provider', 'firstName lastName phoneNumber');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (
      booking.provider.toString() !== req?.user?.id &&
      booking.customer.toString() !== req?.user?.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId) as (IBooking & Document & { _id: Types.ObjectId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req?.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req?.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    // Update service rating
    const service = await Service.findById(booking.service);
    if (service) {
      const bookings = await Booking.find({
        service: service._id,
        rating: { $exists: true },
      });
      const totalRating = bookings.reduce((sum, b) => sum + (b.rating || 0), 0);
      service.rating = totalRating / bookings.length;
      await service.save();
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 