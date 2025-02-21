export const API_URL = process.env.REACT_APP_API_URL;

export const ROUTES = {
  TRANSACTION: {
    VERIFY: `${API_URL}/api/transaction/verify`,
    FUND: {
      GET_BY_USER: `${API_URL}/api/transaction/fund/user`,
      TRANSFER: `${API_URL}/api/transaction/fund/transfer`,
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
  }

};
