"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = exports.createPaymentIntent = exports.updateBookingStatus = exports.getBookingById = exports.getBookings = exports.createBooking = void 0;
const Booking_1 = require("../models/Booking");
const Service_1 = require("../models/Service");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId, date, address, description, emergency } = req.body;
        const service = yield Service_1.Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        const booking = new Booking_1.Booking({
            service: serviceId,
            customer: req?.user?.id,
            provider: service.provider,
            date,
            address,
            description,
            price: service.basePrice,
            emergency,
        });
        yield booking.save();
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createBooking = createBooking;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, startDate, endDate } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const bookings = yield Booking_1.Booking.find(filter)
            .populate('service', 'name basePrice')
            .populate('customer', 'firstName lastName')
            .populate('provider', 'firstName lastName')
            .sort({ date: -1 });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBookings = getBookings;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield Booking_1.Booking.findById(req.params.id)
            .populate('service', 'name basePrice')
            .populate('customer', 'firstName lastName phoneNumber')
            .populate('provider', 'firstName lastName phoneNumber');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBookingById = getBookingById;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const booking = yield Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.provider.toString() !== req?.user?.id &&
            booking.customer.toString() !== req?.user?.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        booking.status = status;
        yield booking.save();
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateBookingStatus = updateBookingStatus;
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.body;
        const booking = yield Booking_1.Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.customer.toString() !== req?.user?.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(booking.price * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                bookingId: booking?._id?.toString(),
            },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, review } = req.body;
        const booking = yield Booking_1.Booking.findById(req.params.id);
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
        yield booking.save();
        // Update service rating
        const service = yield Service_1.Service.findById(booking.service);
        if (service) {
            const bookings = yield Booking_1.Booking.find({
                service: service._id,
                rating: { $exists: true },
            });
            const totalRating = bookings.reduce((sum, b) => sum + (b.rating || 0), 0);
            service.rating = totalRating / bookings.length;
            yield service.save();
        }
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addReview = addReview;
