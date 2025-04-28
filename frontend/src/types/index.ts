export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'homeowner' | 'provider' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image?: string;
  rating?: number;
  reviews?: Review[];
  isEmergency?: boolean;
  provider: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  service: string | Service;
  user: string | User;
  date: string;
  time: string;
  address: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  service: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  sessionId?: string;
  amount: number;
  currency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 