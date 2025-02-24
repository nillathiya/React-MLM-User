import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../feature/wallet/walletSlice";
import networkReducer from "../feature/network/networkSlice";
import themeReducer from "../feature/theme/themeSlice";
import authReducer from "../feature/auth/authSlice";
import userReducer from "../feature/user/userSlice";
import transactionReducer from "../feature/transaction/transactionSlice";
import topUpReducer from "../feature/topup/topUpSlice";
import ordersReducer from "../feature/order/orderSlice";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY;

// Encrypt function
const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

// Decrypt function
const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

// 🔒 Create encryption transform for transactions
const transactionEncryptTransform = createTransform(
    (inboundState) => encryptData(inboundState),  // Encrypt before saving
    (outboundState) => decryptData(outboundState),  // Decrypt when reading
);

// Persist Configs
const transactionPersistConfig = {
    key: "transaction",
    storage,
    transforms: [transactionEncryptTransform], // Apply encryption
    whitelist: ["transactions"], // Ensure only transactions are persisted
};

const walletPersistConfig = {
    key: "wallet",
    storage,
    transforms: [transactionEncryptTransform],
    whitelist: ["userWallet"],
};

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['currentUser', 'isLoggedIn'],
};

// Apply persistence
const persistedWalletReducer = persistReducer(walletPersistConfig, walletReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTransactionReducer = persistReducer(transactionPersistConfig, transactionReducer);

// Create Redux Store
export const store = configureStore({
    reducer: {
        wallet: persistedWalletReducer,
        network: networkReducer,
        theme: themeReducer,
        auth: persistedAuthReducer,
        user: userReducer,
        transaction: persistedTransactionReducer, // 🔒 Use encrypted persisted reducer
        topUp: topUpReducer,
        orders: ordersReducer
    },
});

export const persistor = persistStore(store);
