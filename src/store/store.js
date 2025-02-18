import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../feature/wallet/walletSlice";
import networkReducer from "../feature/network/networkSlice";
import themeReducer from "../feature/theme/themeSlice";

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        network: networkReducer,
        theme: themeReducer,
    },
});

export default store