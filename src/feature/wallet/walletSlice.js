import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserWallet } from "./walletApi";
import { WalletMapping } from "../../constants/wallet";
import CryptoJS from "crypto-js";

const initialState = {
  address: null,
  userWallet:null,
};

export const getUserWalletAsync = createAsyncThunk(
  'wallet/getUserWallet',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUserWallet(userId);
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

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (state, action) => {
      console.log("action payload", action);
      state.address = action.payload;
    },
    addAmountToWallet: (state, action) => {
      const { walletType, amount } = action.payload;
      if (walletType && amount > 0) {
        state.userWallet[walletType] = (state.userWallet[walletType] || 0) + parseFloat(amount);
      }
    },
    removeAmountFromWallet: (state, action) => {
      const { walletType, amount } = action.payload;
      if (walletType && state.userWallet[walletType] >= amount) {
        state.userWallet[walletType] -= parseFloat(amount);
      } else {
        console.error(`Insufficient balance in ${walletType}`);
      }
    },
    clearUserWallet:(state)=>{
      state.userWallet =null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getUserWalletAsync
      .addCase(getUserWalletAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserWalletAsync.fulfilled, (state, action) => {
        state.loading = false;
        const encryptedWallet = action.payload.data;

        if (typeof encryptedWallet !== "string") {
          console.error("Received data is not encrypted:", encryptedWallet);
          state.userWallet = encryptedWallet;
          return;
        }

        try {
          const decryptedData = CryptoJS.AES.decrypt(
            encryptedWallet,
            process.env.REACT_APP_CRYPTO_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8);


          if (!decryptedData || decryptedData.trim() === "") {
            console.error("Decryption failed. Empty or invalid string.");
            return;
          } 

          const decryptedWallet = JSON.parse(decryptedData);

          if (!decryptedWallet || Object.keys(decryptedWallet).length === 0) {
            console.error("Decrypted wallet is empty.");
            return;
          }

          const skipKeys = ["_id", "uCode", "username", "createdAt", "updatedAt", "__v"];


          state.userWallet = Object.fromEntries(
            Object.entries(decryptedWallet)
              .filter(([key]) => !skipKeys.includes(key))
              .map(([key, value]) => [WalletMapping[key] || key, value])
          );


        } catch (error) {
          console.error("Decryption error:", error);
        }
      })
      .addCase(getUserWalletAsync.rejected, (state, action) => {
        state.loading = false;
      })
  }
});

export const { setWalletAddress, addAmountToWallet, removeAmountFromWallet,clearUserWallet } = walletSlice.actions;
export default walletSlice.reducer;
