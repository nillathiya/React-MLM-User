import { createSlice } from "@reduxjs/toolkit";
import { NETWORKS } from "./networkConfig";

const initialState = {
  currentNetwork: NETWORKS.BSC_TESTNET // Change to BSC_MAINNET for production
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    switchNetwork: (state, action) => {
      state.currentNetwork = action.payload;
    },
  },
});

export const { switchNetwork } = networkSlice.actions;
export default networkSlice.reducer;

export const selectCurrentNetwork =(state)=>state.network.currentNetwork;