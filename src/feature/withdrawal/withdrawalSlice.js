import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addTransaction, addTransactionByTransactionType } from "../transaction/transactionSlice";
import { userFundWithdrawal, fetchUserFundWithdrawalHistory } from "./withdrawalApi";
import { getUserWalletAsync } from "../wallet/walletSlice";
import {FUND_TX_TYPE} from "../../utils/constatnt"
const initialState = {
    loading: false,
    error: null,
};

export const userFundWithdrawalAsync = createAsyncThunk(
    "withdrawal/userFundWithdrawal",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const data = await userFundWithdrawal(formData);
            dispatch(addTransaction(data.data));
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }
);

export const fetchUserFundWithdrawalHistoryAsync = createAsyncThunk(
    "withdrawal/fetchUserFundWithdrawalHistory",
    async (formData, { rejectWithValue, dispatch, getState }) => {
        try {
            const { auth } = getState();
            const currentUser = auth.currentUser;

            const data = await fetchUserFundWithdrawalHistory(formData);
            if (data?.data) {
                dispatch(
                    addTransactionByTransactionType({
                        txType:FUND_TX_TYPE.FUND_WITHDRAWAL,
                        data: data.data,
                    })
                );
            }

            if (currentUser?._id) {
                await dispatch(getUserWalletAsync(currentUser._id));
            }

            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }
);

const withdrawalSlice = createSlice({
    name: "withdrawal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // userFundWithdrawalAsync
            .addCase(userFundWithdrawalAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userFundWithdrawalAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(userFundWithdrawalAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchUserFundWithdrawalHistoryAsync
            .addCase(fetchUserFundWithdrawalHistoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserFundWithdrawalHistoryAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchUserFundWithdrawalHistoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default withdrawalSlice.reducer;
