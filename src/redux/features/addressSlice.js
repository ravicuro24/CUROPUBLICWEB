// src/redux/features/addressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Authorization/axiosInstance'; // adjust path if needed

// Async thunk for fetching addresses
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue('No user ID provided');

    try {
      const res = await axiosInstance.get(`/endUserAddress/getAddressByUserId/${userId}`);
      const list = Array.isArray(res?.data?.dto) ? [...res.data.dto].reverse() : [];
      return list;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch addresses');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAddresses: (state) => {
      state.addresses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.addresses = [];
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
