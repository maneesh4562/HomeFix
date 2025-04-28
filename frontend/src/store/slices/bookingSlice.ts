import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking } from '../../types';
import { bookings } from '../../services/api';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

export const getBookings = createAsyncThunk(
  'bookings/getAll',
  async (filters: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const response = await bookings.getAll(filters);
      if (!response.data) {
        throw new Error('No bookings data received');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const getBookingById = createAsyncThunk(
  'bookings/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bookings.getById(id);
      if (!response.data) {
        throw new Error('No booking data received');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch booking');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData: Partial<Booking>, { rejectWithValue }) => {
    try {
      const response = await bookings.create(bookingData);
      if (!response.data) {
        throw new Error('No booking data received');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ id, data }: { id: string; data: Partial<Booking> }, { rejectWithValue }) => {
    try {
      const response = await bookings.update(id, data);
      if (!response.data) {
        throw new Error('No booking data received');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bookings.cancel(id);
      if (!response.data) {
        throw new Error('No booking data received');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Bookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Booking by ID
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedBooking = action.payload;
        }
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.bookings.push(action.payload);
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.bookings.findIndex((b) => b._id === action.payload._id);
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
          if (state.selectedBooking?._id === action.payload._id) {
            state.selectedBooking = action.payload;
          }
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.bookings.findIndex((b) => b._id === action.payload._id);
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
          if (state.selectedBooking?._id === action.payload._id) {
            state.selectedBooking = action.payload;
          }
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer; 