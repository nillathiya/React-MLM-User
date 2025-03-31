import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPinDetails, createTopUp } from "./topUpApi";

const initialState = {
    loading: false,
    pinDetails: [],
};

export const getPinDetailsAsync = createAsyncThunk(
    'topUp/getPinDetails',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getPinDetails();
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

export const createTopUpAsync = createAsyncThunk(
    'topUp/createTopUp',
    async (formData, { rejectWithValue }) => {
        try {
            const data = await createTopUp(formData);
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


const topUpSlice = createSlice({
    name: "topUp",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getPinDetailsAsync
            .addCase(getPinDetailsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPinDetailsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.pinDetails = action.payload.data;
            })
            .addCase(getPinDetailsAsync.rejected, (state, action) => {
                state.loading = false;
            })
            // createTopUpAsync
            .addCase(createTopUpAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTopUpAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.pinDetails = action.payload.data;
            })
            .addCase(createTopUpAsync.rejected, (state, action) => {
                state.loading = false;
            })
    }
});


export default topUpSlice.reducer;
