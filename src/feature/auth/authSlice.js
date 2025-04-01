import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserProfileAsync } from "../user/userSlice";

const initialState = {
  loading: false,
  userExists: null,
  currentUser: null,
  isLoggedIn: false,
  loginByAdmin: false,
};

export const userLoginAsync = createAsyncThunk(
  "auth/userLogin",
  async (formData, { rejectWithValue }) => {
    try {
      const { userLogin } = await import("./authApi");
      const data = await userLogin(formData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const checkWalletAsync = createAsyncThunk(
  "auth/checkWallet",
  async (formData, { rejectWithValue }) => {
    try {
      const { checkWallet } = await import("./authApi");
      const data = await checkWallet(formData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const verifyTokenLoginAsync = createAsyncThunk(
  "auth/verifyTokenLogin",
  async (token, { rejectWithValue }) => {
    try {
      const { verifyTokenLogin } = await import("./authApi");
      const data = await verifyTokenLogin(token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const userLogoutAsync = createAsyncThunk(
  "auth/userLogout",
  async (_, { rejectWithValue }) => {
    try {
      const { userLogout } = await import("./authApi");
      const data = await userLogout();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Define the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.loginByAdmin = false;
    },
    clearUserExists(state) {
      state.userExists = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // userLoginAsync
      .addCase(userLoginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLoginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data.user;
        state.isLoggedIn = true;
        // Store token in localStorage if returned
        if (action.payload.data.token) {
          localStorage.setItem(`userToken_${action.payload.data.user._id}`, action.payload.data.token);
        }
      })
      .addCase(userLoginAsync.rejected, (state) => {
        state.loading = false;
      })

      // checkWalletAsync
      .addCase(checkWalletAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkWalletAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userExists = action.payload.data.exists;
      })
      .addCase(checkWalletAsync.rejected, (state) => {
        state.loading = false;
      })
      // updateUserProfileAsync
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        console.log("User updated...");
        state.currentUser = action.payload.data;
      })
      .addCase(updateUserProfileAsync.rejected, (state) => {
        state.loading = false;
      })
      // verifyTokenLoginAsync
      .addCase(verifyTokenLoginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyTokenLoginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data.user;
        state.isLoggedIn = true;
        // Remove or fix this line if unintended
        // state.updateUserProfileAsync = true;
        if (action.payload.data.token) {
          localStorage.setItem(`userToken_${action.payload.data.user._id}`, action.payload.data.token);
        }
      })
      .addCase(verifyTokenLoginAsync.rejected, (state) => {
        state.loading = false;
      })
      // userLogoutAsync
      .addCase(userLogoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isLoggedIn = false;
        state.loginByAdmin = false;
      })
      .addCase(userLogoutAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Export the reducer and actions
export const { setUser, clearUser, clearUserExists } = authSlice.actions;
export default authSlice.reducer;

// Export selectors with state type
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectLoader = (state) => state.auth.loading;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserExists = (state) => state.auth.userExists;