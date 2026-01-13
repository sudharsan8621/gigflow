import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchGigs = createAsyncThunk('gigs/fetchGigs', async (params = {}, { rejectWithValue }) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/gigs?${queryString}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
  }
});

export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/gigs/user/my-gigs');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs');
  }
});

export const fetchGig = createAsyncThunk('gigs/fetchGig', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
  }
});

export const createGig = createAsyncThunk('gigs/createGig', async (gigData, { rejectWithValue }) => {
  try {
    const response = await api.post('/gigs', gigData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
  }
});

export const deleteGig = createAsyncThunk('gigs/deleteGig', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/gigs/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete gig');
  }
});

const initialState = {
  gigs: [],
  myGigs: [],
  currentGig: null,
  loading: false,
  error: null,
};

const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    clearCurrentGig: (state) => { state.currentGig = null; },
    updateGigStatus: (state, action) => {
      const { gigId, status, hiredFreelancerId } = action.payload;
      const gig = state.gigs.find((g) => g._id === gigId);
      if (gig) { gig.status = status; gig.hiredFreelancerId = hiredFreelancerId; }
      const myGig = state.myGigs.find((g) => g._id === gigId);
      if (myGig) { myGig.status = status; myGig.hiredFreelancerId = hiredFreelancerId; }
      if (state.currentGig && state.currentGig._id === gigId) {
        state.currentGig.status = status;
        state.currentGig.hiredFreelancerId = hiredFreelancerId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGigs.fulfilled, (state, action) => { state.loading = false; state.gigs = action.payload.gigs; })
      .addCase(fetchGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyGigs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyGigs.fulfilled, (state, action) => { state.loading = false; state.myGigs = action.payload.gigs; })
      .addCase(fetchMyGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchGig.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGig.fulfilled, (state, action) => { state.loading = false; state.currentGig = action.payload.gig; })
      .addCase(fetchGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createGig.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createGig.fulfilled, (state, action) => { state.loading = false; state.gigs.unshift(action.payload.gig); state.myGigs.unshift(action.payload.gig); })
      .addCase(createGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteGig.fulfilled, (state, action) => { state.gigs = state.gigs.filter((gig) => gig._id !== action.payload); state.myGigs = state.myGigs.filter((gig) => gig._id !== action.payload); });
  },
});

export const { clearCurrentGig, updateGigStatus } = gigSlice.actions;
export default gigSlice.reducer;