import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../feature/wallet/walletSlice";
import networkReducer from "../feature/network/networkSlice";

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        network: networkReducer,
    },
});

export default store