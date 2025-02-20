import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../feature/wallet/walletSlice";
import networkReducer from "../feature/network/networkSlice";
import themeReducer from "../feature/theme/themeSlice";
import authReducer from "../feature/auth/authSlice";
import userReducer from "../feature/user/userSlice";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['currentUser', 'isLoggedIn'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
export const store = configureStore({

    reducer: {
        wallet: walletReducer,
        network: networkReducer,
        theme: themeReducer,
        auth: persistedAuthReducer,
        user: userReducer,
    },
});

export const persistor = persistStore(store);

