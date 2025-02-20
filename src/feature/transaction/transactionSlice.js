import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyTransaction } from './transactionApi';

const initialState = {
  loading: false,
};

export const verifyTransactionAsync = createAsyncThunk(
  'transaction/verifyTransaction',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await verifyTransaction(formData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  },
);


// Define the slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // verifyTransactionAsync
      .addCase(verifyTransactionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyTransactionAsync.fulfilled, (state, action) => {
        console.log('authSlice fulfilled', action.payload);
        state.loading = false;
      })
      .addCase(verifyTransactionAsync.rejected, (state, action) => {
        state.loading = false;
      })

  },
});

export default transactionSlice.reducer;
