import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://homefix.vercel.app'  // Your Vercel frontend domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ... rest of your app configuration ... 