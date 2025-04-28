import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema); 