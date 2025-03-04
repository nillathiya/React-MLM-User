import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerNewUser, checkUsername, getUserRankAndTeamMetrics, getUserDirects, getUserGenerationTree, getUserDetailsWithInvestmentInfo } from './userApi';
import CryptoJS from "crypto-js";

const initialState = {
  user: null,
  users: [],
  userDirects: [],
  userGenerationTree: [],
  rankData: null,
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


export const checkUsernameAsync = createAsyncThunk(
  'users/checkUsername',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await checkUsername(formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const getUserRankAndTeamMetricsAsync = createAsyncThunk(
  'users/getUserRankAndTeamMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserRankAndTeamMetrics();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const getUserDirectsAsync = createAsyncThunk(
  'users/getUserDirects',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserDirects();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const getUserGenerationTreeAsync = createAsyncThunk(
  'users/getUserGenerationTree',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserGenerationTree();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const getUserDetailsWithInvestmentInfoAsync = createAsyncThunk(
  'users/getUserDetailsWithInvestmentInfo',
  async (formData, { signal, rejectWithValue }) => {
    try {
      const data = await getUserDetailsWithInvestmentInfo(formData, signal);
      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was aborted");
        return rejectWithValue("Request canceled");
      }
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
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
      })
      // checkUsernameAsync
      .addCase(checkUsernameAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUsernameAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(checkUsernameAsync.rejected, (state) => {
        state.isLoading = false;
      })
      // getUserRankAndTeamMetricsAsync
      .addCase(getUserRankAndTeamMetricsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserRankAndTeamMetricsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rankData = action.payload.data;
      })
      .addCase(getUserRankAndTeamMetricsAsync.rejected, (state) => {
        state.isLoading = false;
      })
      // getUserDirectsAsync
      .addCase(getUserDirectsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDirectsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDirects = action.payload.data;
      })
      .addCase(getUserDirectsAsync.rejected, (state) => {
        state.isLoading = false;
      })
      // getUserGenerationTreeAsync
      .addCase(getUserGenerationTreeAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserGenerationTreeAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const response = action.payload;
        const encryptedUserGenerationData = response.data;

        if (!encryptedUserGenerationData) {
          console.error("Error: No encrypted data received!");
          return;
        }

        try {
          const decryptedData = CryptoJS.AES.decrypt(
            encryptedUserGenerationData,
            process.env.REACT_APP_CRYPTO_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8);


          if (!decryptedData) {
            console.error("Error: Decryption resulted in empty data!");
            return;
          }

          const decryptedUserGenerationData = JSON.parse(decryptedData);

          state.userGenerationTree = decryptedUserGenerationData;
        } catch (error) {
          console.error("Decryption failed:", error);
        }

      })
      .addCase(getUserGenerationTreeAsync.rejected, (state) => {
        state.isLoading = false;
      })
      // getUserDetailsWithInvestmentInfoAsync
      .addCase(getUserDetailsWithInvestmentInfoAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetailsWithInvestmentInfoAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const encryptedUserDetails = action.payload.data;

        if (typeof encryptedUserDetails !== "string") {
          console.error("Received data is not encrypted:", encryptedUserDetails);
          return;
        }

        try {
          const decryptedData = CryptoJS.AES.decrypt(
            encryptedUserDetails,
            process.env.REACT_APP_CRYPTO_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8);


          if (!decryptedData || decryptedData.trim() === "") {
            console.error("Decryption failed. Empty or invalid string.");
            return;
          }

          const decryptedUserDetails = JSON.parse(decryptedData);
          state.user = decryptedUserDetails

        } catch (error) {
          console.error("Decryption error:", error);
        }

      })
      .addCase(getUserDetailsWithInvestmentInfoAsync.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export default userSlice.reducer;

// Selectors
export const selectUser = (state) => state.users.user;
export const selectUsers = (state) => state.users.users;
export const selectPaginationData = (state) => state.users.pagination;
export const selectLoading = (state) => state.users.isLoading;
