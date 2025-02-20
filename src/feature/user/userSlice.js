import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerNewUser } from './userApi';

const initialState = {
  user: null, // Change from array to object (since it stores a single user)
  users: [], // This should be updated when fetching users (not in this slice)
  isLoading: false,
  pagination: null,
};

export const registerNewUserAsync = createAsyncThunk(
  'users/registerNewUser',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await registerNewUser(formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register New User
      .addCase(registerNewUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerNewUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(registerNewUserAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default userSlice.reducer;

// Selectors
export const selectUser = (state) => state.users.user;
export const selectUsers = (state) => state.users.users;
export const selectPaginationData = (state) => state.users.pagination;
export const selectLoading = (state) => state.users.isLoading;
