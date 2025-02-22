import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verifyTransaction, getFundTransactionsByUser, userFundTransfer, userConvertFunds, getTransactionsByUser } from './transactionApi';

const initialState = {
  loading: false,
  transactions: [],
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

export const getTransactionsByUserAsync = createAsyncThunk(
  'transaction/getTransactionsByUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTransactionsByUser();
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
  async (_, { rejectWithValue }) => {
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

export const userConvertFundsAsync = createAsyncThunk(
  'transaction/userConvertFunds',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await userConvertFunds(formData);
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
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    clearAllFundTransactions: (state) => {
      state.transactions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // verifyTransactionAsync
      .addCase(verifyTransactionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyTransactionAsync.fulfilled, (state, action) => {
        state.transactions.push(action.payload.data);
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

        state.loading = false;
        state.transactions = action.payload.data;
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
        state.transactions.push(action.payload.data);
      })
      .addCase(userFundTransferAsync.rejected, (state, action) => {
        state.loading = false;
      })

      // userConvertFundsAsync
      .addCase(userConvertFundsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(userConvertFundsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload.data);
      })
      .addCase(userConvertFundsAsync.rejected, (state, action) => {
        state.loading = false;
      })
      // getTransactionsByUserAsync
      .addCase(getTransactionsByUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionsByUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = [...state.transactions, ...action.payload.data];
      })      
      .addCase(getTransactionsByUserAsync.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export const { addTransaction, clearAllFundTransactions } = transactionSlice.actions;

export const selectAddFundHistory = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === "user_add_fund");

export const selectUserFundTransfer = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === "user_fund_transfer");

export const selectUserFundConvertHistory = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === "user_fund_convert");

export const selectTransactionLoading = (state) => state.transaction.loading
export default transactionSlice.reducer;
