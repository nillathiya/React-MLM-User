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
    },
    INCOME: {
      GET_BY_USER: (
        source
      ) => {
        const query = new URLSearchParams();
        if (source !== undefined && source !== null)
          query.append('source', source.trim().toString());
        return `${API_URL}/api/transaction/income/user?${query.toString()}`;
      },

    }
  },
  AUTH: {
    CHECK_WALLET: `${API_URL}/api/auth/user/check-wallet`,
    USER_WALLET: `${API_URL}/api/auth/user/login`

  },
  USER: {
    REGISTER: `${API_URL}/api/user/create`,
    CHECK_NAME: `${API_URL}/api/user/check-name`,
    GET_USER_RANK_AND_TEAM_METRICS: `${API_URL}/api/rank-settings/user`,
    GET_DIRECTS: `${API_URL}/api/user/get-directs`,
    GET_GENERATION_TREE: `${API_URL}/api/user/generation-tree`,
    GET_DETAILS_WITH_INVEST_INFO: `${API_URL}/api/user/details-with-investment`,
    UPDATE_PROFILE: `${API_URL}/api/user/update/profile`
  },
  WALLET: {
    CREATE: `${API_URL}/api/wallet/create`,
    USER_WALLET: `${API_URL}/api/wallet/user`
  },
  PIN_DETAILS: {
    GET_ALL: `${API_URL}/api/pin-detail/get`
  },
  TOPUP: {
    CREATE: `${API_URL}/api/top-up/create`
  },
  ORDERS: {
    GET_BY_USER: `${API_URL}/api/orders/user`
  },
  WITHDRAWAL: {
    CREATE_REQUEST: `${API_URL}/api/withdrawal/create-request`,
    GET_USER_FUND_WITHDRAWAL: `${API_URL}/api/withdrawal/get-user-transactions`
  }
};
