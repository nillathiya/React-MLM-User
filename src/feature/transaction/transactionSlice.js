import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verifyTransaction, getFundTransactionsByUser, userFundTransfer, userConvertFunds, getTransactionsByUser, getIncomeTransactionsByUser } from './transactionApi';
import CryptoJS from "crypto-js";
import { FUND_TX_TYPE } from "../../utils/constant";

const initialState = {
  loading: false,
  incomeTransactionsLoading: false,
  transactions: [],
  incomeTransactions: [],
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

export const getIncomeTransactionsByUserAsync = createAsyncThunk(
  'transaction/getIncomeTransactionsByUser',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getIncomeTransactionsByUser(params);
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
    },
    addTransactionByTransactionType: (state, action) => {
      const { txType, data } = action.payload;
      state.transactions = [
        ...state.transactions.filter((tx) => tx.txType !== txType),
        ...data
      ];
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
        const newTransaction = action.payload.data;
        const index = state.transactions.findIndex((tx) => tx._id === newTransaction._id);

        if (index === -1) {
          state.transactions.push(newTransaction);
        } else {
          state.transactions[index] = newTransaction;
        }
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

      // getIncomeTransactionsByUserAsync
      .addCase(getIncomeTransactionsByUserAsync.pending, (state) => {
        state.incomeTransactionsLoading = true;
      })
      .addCase(getIncomeTransactionsByUserAsync.fulfilled, (state, action) => {
        state.incomeTransactionsLoading = false;
        const response = action.payload;
        const encryptedIncomeTransactionData = response.data;

        // console.log("Encrypted Data:", encryptedIncomeTransactionData);

        if (!encryptedIncomeTransactionData) {
          console.error("Error: No encrypted data received!");
          return;
        }

        try {
          const decryptedData = CryptoJS.AES.decrypt(
            encryptedIncomeTransactionData,
            process.env.REACT_APP_CRYPTO_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8);

          // console.log("Decrypted Raw Data:", decryptedData);

          if (!decryptedData) {
            console.error("Error: Decryption resulted in empty data!");
            return;
          }

          const decryptedIncomeTransaction = JSON.parse(decryptedData);

          // console.log("Decrypted Transactions:", decryptedIncomeTransaction);
          state.incomeTransactions = decryptedIncomeTransaction;
        } catch (error) {
          console.error("Decryption failed:", error);
        }
      })
      .addCase(getIncomeTransactionsByUserAsync.rejected, (state, action) => {
        state.incomeTransactionsLoading = false;
      })
  },
});

export const { addTransaction, clearAllFundTransactions, addTransactionByTransactionType } = transactionSlice.actions;

export const selectAddFundHistory = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === FUND_TX_TYPE.FUND_ADD);

export const selectUserFundTransfer = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === FUND_TX_TYPE.FUND_TRANSFER);

export const selectUserFundConvertHistory = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === FUND_TX_TYPE.FUND_CONVERT);

export const selectUserFundWithdrwalHistory = (state) =>
  state.transaction.transactions.filter((tx) => tx.txType === FUND_TX_TYPE.FUND_WITHDRAWAL);

export const selectTransactionLoading = (state) => state.transaction.loading
export default transactionSlice.reducer;
