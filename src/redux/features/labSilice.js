import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Authorization/axiosInstance";

// Async thunk for fetching popular packages
export const fetchPopularPackages = createAsyncThunk(
  "packages/fetchPopularPackages",
  async ({ pageSize, pageNumber, latitude, longitude, distance }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/endUserEndPoint/getPopularPackages?pageSize=${pageSize}&pageNumber=${pageNumber}&lat=${latitude}&lng=${longitude}&distance=${distance}`
      );

      return response.data?.dtoList || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch packages");
    }
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    packages: [],
    loading: false,
    error: null,
    pageNumber: 1,
  },

  reducers: {
    clearPackages: (state) => {
      state.packages = [];
      state.error = null;
      state.pageNumber = 1;
    },
    nextPage: (state) => {
      state.pageNumber += 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPopularPackages.fulfilled, (state, action) => {
        state.loading = false;

        if (state.pageNumber === 1) {
          state.packages = action.payload;
        } else {
          state.packages = [...state.packages, ...action.payload];
        }
      })

      .addCase(fetchPopularPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPackages, nextPage } = packagesSlice.actions;
export default packagesSlice.reducer;
