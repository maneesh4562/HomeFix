"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protected routes
router.post('/', auth_1.auth, bookingController_1.createBooking);
router.get('/', auth_1.auth, bookingController_1.getBookings);
router.get('/:id', auth_1.auth, bookingController_1.getBookingById);
router.patch('/:id/status', auth_1.auth, bookingController_1.updateBookingStatus);
router.post('/:id/review', auth_1.auth, bookingController_1.addReview);
router.post('/payment-intent', auth_1.auth, bookingController_1.createPaymentIntent);
exports.default = router;
