import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  provider: mongoose.Types.ObjectId;
  isEmergency: boolean;
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'pest_control', 'appliance_repair', 'gardening'],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    availability: {
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      }],
      hours: {
        start: {
          type: String,
          required: true,
        },
        end: {
          type: String,
          required: true,
        },
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }],
    images: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>('Service', serviceSchema); 