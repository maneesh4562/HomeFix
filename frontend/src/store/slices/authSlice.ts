import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../services/api';
import { User } from '../../types';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface TokenPayload {
  id: string;
  exp: number;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Check token validity
const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Initialize auth state from localStorage
const token = localStorage.getItem('token');
if (token && isTokenValid(token)) {
  initialState.token = token;
  initialState.isAuthenticated = true;
} else {
  localStorage.removeItem('token');
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Login thunk started with credentials:', { email: credentials.email });
      const response = await auth.login(credentials);
      
      if (!response.token || !response.user) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }

      console.log('Login successful, setting token and user data');
      localStorage.setItem('token', response.token);
      return response as AuthResponse;
    } catch (error: any) {
      console.error('Login thunk error:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        console.error('Server error message:', error.response.data.message);
        return rejectWithValue(error.response.data.message);
      }
      
      if (error.response) {
        console.error('Response error:', {
          status: error.response.status,
          data: error.response.data
        });
        return rejectWithValue('Login failed. Please check your credentials.');
      }
      
      if (error.request) {
        console.error('Network error:', error.request);
        return rejectWithValue('Network error. Please check your connection.');
      }
      
      console.error('Unexpected error:', error);
      return rejectWithValue(error.message || 'An unexpected error occurred during login.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: Partial<User> & { password: string }, { rejectWithValue }) => {
    try {
      const response = await auth.register(userData);
      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('token', response.data.token);
      return response.data as AuthResponse;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed');
      }
      if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching profile in thunk...');
      const user = await auth.getProfile();
      console.log('Profile fetched successfully:', user);
      return user;
    } catch (error: any) {
      console.error('Profile thunk error:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      }
      
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      console.log('Updating user with:', userData);
      const user = await auth.updateProfile(userData);
      if (!user) {
        throw new Error('Invalid response from server');
      }
      console.log('User updated successfully:', user);
      return user;
    } catch (error: any) {
      console.error('Update user error:', error);
      
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      }
      
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload === 'Session expired. Please login again.') {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 