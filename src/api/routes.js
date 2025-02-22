export const API_URL = process.env.REACT_APP_API_URL;

export const ROUTES = {
  TRANSACTION: {
    VERIFY: `${API_URL}/api/transaction/verify`,
    GET_ALL: `${API_URL}/api/transaction/get-all`,
    GET_BY_USER: `${API_URL}/api/transaction/user`,
    FUND: {
      GET_BY_USER: `${API_URL}/api/transaction/fund/user`,
      TRANSFER: `${API_URL}/api/transaction/fund/transfer`,
      CONVERT: `${API_URL}/api/transaction/fund/convert`,
    }
  },
  AUTH: {
    CHECK_WALLET: `${API_URL}/api/auth/user/check-wallet`,
    USER_WALLET: `${API_URL}/api/auth/user/login`

  },
  USER: {
    REGISTER: `${API_URL}/api/user/create`
  },
  WALLET: {
    // TRANSACTIONS: `${API_URL}/api/wallet/transactions`,
    USER_WALLET: `${API_URL}/api/wallet/user`
  },
  PIN_DETAILS: {
    GET_ALL: `${API_URL}/api/pin-detail/get`
  },
  TOPUP:{
    CREATE: `${API_URL}/api/top-up/create`
  }
};
