import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserTeamDetails } from "./teamApi";

const initialState = {
  activeDirects: 0,
  inactiveDirects: 0,
  directBusiness: 0,
  totalTeam: 0,
  totalBusiness: 0,
  inactiveTeam: 0,
  loading: false,
  error: null,
};

export const getUserTeamDetailsAsync = createAsyncThunk(
  'team/getUserTeamDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserTeamDetails(userId);
      return response.data; // Return only the `data` object
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setActiveDirects: (state, action) => {
      state.activeDirects = action.payload;
    },
    setInactiveDirects: (state, action) => {
      state.inactiveDirects = action.payload;
    },
    setDirectBusiness: (state, action) => {
      state.directBusiness = action.payload;
    },
    setTotalTeam: (state, action) => {
      state.totalTeam = action.payload;
    },
    setTotalBusiness: (state, action) => {
      state.totalBusiness = action.payload;
    },
    setInactiveTeam: (state, action) => {
      state.inactiveTeam = action.payload;
    },
    clearTeamDetails: (state) => {
      state.activeDirects = 0;
      state.inactiveDirects = 0;
      state.directBusiness = 0;
      state.totalTeam = 0;
      state.totalBusiness = 0;
      state.inactiveTeam = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserTeamDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTeamDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeDirects = action.payload.activeDirects || 0;
        state.inactiveDirects = action.payload.inactiveDirects || 0;
        state.directBusiness = action.payload.directBusiness || 0;
        state.totalTeam = action.payload.totalTeam || 0;
        state.totalBusiness = action.payload.totalBusiness || 0;
        state.inactiveTeam = action.payload.inactiveTeam || 0;
      })
      .addCase(getUserTeamDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;