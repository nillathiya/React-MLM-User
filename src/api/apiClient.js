import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Define apiClient without interceptors initially
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility to get user token from localStorage
const getUserToken = (userId) => {
  return localStorage.getItem(`userToken_${userId}`);
};

// Function to set up interceptors with a provided store
export const setupApiInterceptors = (store) => {
  // Request Interceptor: Attach user token
  apiClient.interceptors.request.use(
    (config) => {
      const { auth } = store.getState();
      const loggedInUser = auth.currentUser;

      if (loggedInUser && loggedInUser._id) {
        const userToken = getUserToken(loggedInUser._id);
        if (userToken) {
          console.log("userToken Found!")
          config.headers.Authorization = `Bearer ${userToken}`;
        }
      }

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    },
  );

  // Response Interceptor: Handle 401 errors
  let isLoggingOut = false; // Prevent infinite 401 loop
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        try {
          console.warn('Session expired, logging out user...');
          const { clearUser, clearUserExists, userLogoutAsync } = await import('../feature/auth/authSlice');
          const { clearUserWallet, clearCompanyInfo, clearUserSettings } = await import('../feature/user/userSlice');
          const { clearAllFundTransactions } = await import('../feature/transaction/transactionSlice');

          const dispatch = store.dispatch;

          await Promise.all([
            dispatch(userLogoutAsync()),
            dispatch(clearUser()),
            dispatch(clearUserExists()),
            dispatch(clearUserWallet()),
            dispatch(clearAllFundTransactions()),
            dispatch(clearCompanyInfo()),
            dispatch(clearUserSettings()),
          ]);

          // Clear token from localStorage
          const { auth } = store.getState();
          const loggedInUser = auth.currentUser;
          if (loggedInUser?._id) {
            localStorage.removeItem(`userToken_${loggedInUser._id}`);
          }

          window.location.href = '/';
        } catch (err) {
          console.error('Error during 401 handling:', err);
          window.location.href = '/'; // Fallback redirect
        } finally {
          isLoggingOut = false;
        }
      }

      return Promise.reject(error);
    },
  );
};

// Export a function to initialize interceptors manually if needed
export const initializeInterceptors = async () => {
  try {
    const { store } = await import('../store/store');
    setupApiInterceptors(store);
  } catch (error) {
    console.error('Failed to initialize Axios interceptors:', error);
  }
};

// Optional: Call initializeInterceptors immediately (if store is ready)
initializeInterceptors();