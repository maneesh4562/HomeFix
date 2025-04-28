import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message, type } = req.body;
    
    const notification = new Notification({
      userId,
      message,
      type,
      read: false
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user?.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
}; 