import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyTransaction, getFundTransactionsByUser,userFundTransfer } from './transactionApi';

const initialState = {
  loading: false,
  transactions: [],
  addFunTransactions: [],
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

export const getFundTransactionsByUserAsync = createAsyncThunk(
  'transaction/getFundTransactionsByUser',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await getFundTransactionsByUser();
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


export const userFundTransferAsync = createAsyncThunk(
  'transaction/userFundTransfer',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await userFundTransfer(formData);
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

      // getFundTransactionsByUserAsync
      .addCase(getFundTransactionsByUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFundTransactionsByUserAsync.fulfilled, (state, action) => {
        console.log('Transaction data received:', action.payload);

        state.loading = false;
        state.transactions = action.payload.data;

        // Filter transactions where txType is "ADDFUND"
        state.addFunTransactions = action.payload.data.filter(
          (transaction) => transaction.txType === "ADDFUND"
        );
      })
      .addCase(getFundTransactionsByUserAsync.rejected, (state, action) => {
        state.loading = false;
      })

      // userFundTransferAsync
      .addCase(userFundTransferAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(userFundTransferAsync.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(userFundTransferAsync.rejected, (state, action) => {
        state.loading = false;
      })

  },
});

export default transactionSlice.reducer;
