import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createBid = createAsyncThunk('bids/createBid', async (bidData, { rejectWithValue }) => {
  try {
    const response = await api.post('/bids', bidData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit bid');
  }
});

export const fetchBidsForGig = createAsyncThunk('bids/fetchBidsForGig', async (gigId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/bids/${gigId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
  }
});

export const fetchMyBids = createAsyncThunk('bids/fetchMyBids', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/bids/my-bids');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids');
  }
});

export const hireBid = createAsyncThunk('bids/hireBid', async (bidId, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/bids/${bidId}/hire`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
  }
});

const initialState = {
  bids: [],
  myBids: [],
  loading: false,
  error: null,
  hiringBidId: null,
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearBids: (state) => { state.bids = []; },
    updateBidStatus: (state, action) => {
      const { bidId, status } = action.payload;
      const bid = state.myBids.find((b) => b._id === bidId);
      if (bid) { bid.status = status; }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBid.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBid.fulfilled, (state, action) => { state.loading = false; state.myBids.unshift(action.payload.bid); })
      .addCase(createBid.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchBidsForGig.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => { state.loading = false; state.bids = action.payload.bids; })
      .addCase(fetchBidsForGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyBids.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyBids.fulfilled, (state, action) => { state.loading = false; state.myBids = action.payload.bids; })
      .addCase(fetchMyBids.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(hireBid.pending, (state, action) => { state.hiringBidId = action.meta.arg; state.error = null; })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.hiringBidId = null;
        state.bids = state.bids.map((bid) => ({
          ...bid,
          status: bid._id === action.payload.hiredBid._id ? 'hired' : 'rejected',
        }));
      })
      .addCase(hireBid.rejected, (state, action) => { state.hiringBidId = null; state.error = action.payload; });
  },
});

export const { clearBids, updateBidStatus } = bidSlice.actions;
export default bidSlice.reducer;