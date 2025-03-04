import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserOrders } from "./orderApi";

const initialState = {
    loading: false,
    userOrders: [],
};

export const getUserOrdersAsync = createAsyncThunk(
    'orders/getUserOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getUserOrders(userId);
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

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // getUserOrdersAsync
            .addCase(getUserOrdersAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserOrdersAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.userOrders = action.payload?.data || [];
            })
            .addCase(getUserOrdersAsync.rejected, (state, action) => {
                state.loading = false;
            })
    }
});

export default ordersSlice.reducer;
