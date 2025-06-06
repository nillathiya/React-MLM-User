import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../feature/wallet/walletSlice";
import networkReducer from "../feature/network/networkSlice";
import themeReducer from "../feature/theme/themeSlice";
import authReducer from "../feature/auth/authSlice";
import userReducer from "../feature/user/userSlice";
import transactionReducer from "../feature/transaction/transactionSlice";
import topUpReducer from "../feature/topup/topUpSlice";
import ordersReducer from "../feature/order/orderSlice";
import withdrawalReducer from "../feature/withdrawal/withdrawalSlice";
import teamReducer from "../feature/team/teamSlice"; // Import the team reducer
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY;

// Encrypt function
const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

// Decrypt function
const decryptData = (encryptedData) => {
    try {
        console.log("SECRET_KEY:", SECRET_KEY);
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

// 🔒 Create encryption transform for transactions
const encryptTransform = createTransform(
    (inboundState) => encryptData(inboundState),  // Encrypt before saving
    (outboundState) => decryptData(outboundState),  // Decrypt when reading
);

// Persist Configs
const transactionPersistConfig = {
    key: "transaction",
    storage,
    transforms: [encryptTransform],
    whitelist: ["transactions"],
};

const walletPersistConfig = {
    key: "wallet",
    storage,
    transforms: [encryptTransform],
    whitelist: ["userWallet", "walletSettings"],
};

const authPersistConfig = {
    key: 'auth',
    storage,
    transforms: [encryptTransform],
    whitelist: ['currentUser', 'isLoggedIn', 'loginByAdmin'],
};

const userPersistConfig = {
    key: "user",
    storage,
    transforms: [encryptTransform],
    whitelist: ['companyInfo'],
};

// Optionally persist the team reducer (if needed)
const teamPersistConfig = {
    key: "team",
    storage,
    transforms: [encryptTransform],
    whitelist: ['activeDirects', 'inactiveDirects', 'directBusiness', 'totalTeam', 'totalBusiness', 'inactiveTeam'],
};

const persistedWalletReducer = persistReducer(walletPersistConfig, walletReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTransactionReducer = persistReducer(transactionPersistConfig, transactionReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedTeamReducer = persistReducer(teamPersistConfig, teamReducer); // Persist team reducer

// Create Redux Store
export const store = configureStore({
    reducer: {
        wallet: persistedWalletReducer,
        network: networkReducer,
        theme: themeReducer,
        auth: persistedAuthReducer,
        user: persistedUserReducer,
        transaction: persistedTransactionReducer,
        topUp: topUpReducer,
        orders: ordersReducer,
        withdrawal: withdrawalReducer,
        team: persistedTeamReducer, // Add team reducer
    },
});

export const persistor = persistStore(store);