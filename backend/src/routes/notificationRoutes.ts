import express from 'express';
import { auth } from '../middleware/auth';
import { sendNotification, getNotifications, markAsRead } from '../controllers/notificationController';

const router = express.Router();

// Get all notifications for the user
router.get('/', auth, getNotifications);

// Send a notification
router.post('/', auth, sendNotification);

// Mark notification as read
router.put('/:id/read', auth, markAsRead);

export default router; 