import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return rejectWithValue(null);
  }
});

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.loading = false; })
      .addCase(getMe.pending, (state) => { state.loading = true; })
      .addCase(getMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload?.user || null; })
      .addCase(getMe.rejected, (state) => { state.loading = false; state.user = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;