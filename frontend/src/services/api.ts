import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, User, Service, Booking, PaymentIntent, Review } from '@/types';

// Ensure the API URL is properly set
const baseURL = process.env.REACT_APP_API_URL || 'https://homefix-backend.onrender.com/api';
console.log('API Base URL:', baseURL); // Debug log

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    }); // Debug log
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific authentication errors
    if (error.response?.status === 401) {
      const errorData = error.response.data as { message?: string };
      const errorMessage = errorData?.message || 'Authentication failed';
      
      if (errorMessage.includes('token expired')) {
        localStorage.removeItem('token');
        window.location.href = '/login?error=session_expired';
      } else if (errorMessage.includes('Invalid token')) {
        localStorage.removeItem('token');
        window.location.href = '/login?error=invalid_token';
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Login attempt with:', { email: credentials.email });
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },
  register: async (data: Partial<User> & { password: string }) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data);
    return response.data;
  },
  getProfile: async () => {
    try {
      console.log('Fetching profile...');
      const response = await api.get<User>('/auth/profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile API Error:', error);
      throw error;
    }
  },
  updateProfile: async (data: Partial<User>) => {
    try {
      console.log('Updating profile with:', data);
      const response = await api.put<User>('/auth/profile', data);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
};

// Service endpoints
export const services = {
  getAll: async (filters?: Record<string, any>) => {
    const response = await api.get<ApiResponse<Service[]>>('/services', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data;
  },
  create: async (data: Partial<Service>) => {
    const response = await api.post<ApiResponse<Service>>('/services', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Service>) => {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/services/${id}`);
    return response.data;
  },
};

// Booking endpoints
export const bookings = {
  getAll: async (filters?: Record<string, any>) => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },
  create: async (data: Partial<Booking>) => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Booking>) => {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, data);
    return response.data;
  },
  cancel: async (id: string) => {
    const response = await api.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
    return response.data;
  },
};

// Payment endpoints
export const payments = {
  createPaymentIntent: async (bookingId: string) => {
    const response = await api.post<ApiResponse<PaymentIntent>>(`/payments/create-payment-intent`, { bookingId });
    return response.data;
  },
  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post<ApiResponse<void>>(`/payments/confirm`, { paymentIntentId });
    return response.data;
  },
};

export const reviews = {
  create: async (data: { serviceId: string; rating: number; comment: string }) => {
    const response = await api.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },
  getByService: async (serviceId: string) => {
    const response = await api.get<ApiResponse<Review[]>>(`/reviews/service/${serviceId}`);
    return response.data;
  },
};

export default api; 