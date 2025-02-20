export const API_URL = process.env.REACT_APP_API_URL;

export const ROUTES = {
  TRANSACTION: {
    VERIFY: `${API_URL}/api/transaction/verify`,
  },
  AUTH: {
    CHECK_WALLET: `${API_URL}/api/auth/user/check-wallet`,
    USER_WALLET: `${API_URL}/api/auth/user/login`

  },
  USER: {
    REGISTER: `${API_URL}/api/user/create`
  }
};
