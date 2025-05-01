import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Service } from '../../types';
import { services } from '../../services/api';

interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
};

export const getServices = createAsyncThunk(
  'services/getAll',
  async (filters?: Record<string, any>, { rejectWithValue }: any = { rejectWithValue: () => {} }) => {
    try {
      const response = await services.getAll(filters);
      console.log('Services response:', response); // Debug log
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch services');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching services:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

export const getServiceById = createAsyncThunk(
  'services/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await services.getById(id);
      if (!response.data) {
        throw new Error('No service data received');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch service');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Services
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.services = action.payload;
        }
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Service by ID
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedService = action.payload;
        }
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedService, clearError } = serviceSlice.actions;
export default serviceSlice.reducer; 