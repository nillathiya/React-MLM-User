import axios from 'axios';

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
export const setupApiInterceptors = (store, persistor) => {
  // Request Interceptor: Attach user token
  apiClient.interceptors.request.use(
    (config) => {
      const { auth } = store.getState();
      const loggedInUser = auth.currentUser;

      if (loggedInUser && loggedInUser._id) {
        const userToken = getUserToken(loggedInUser._id);
        if (userToken) {
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
          // Avoid dynamic imports; dispatch actions directly if possible
          // Assume these actions are passed or imported elsewhere
          const dispatch = store.dispatch;

          // Dispatch logout actions (you may need to import these in a different way)
          await dispatch({ type: 'auth/userLogoutAsync' });
          await dispatch({ type: 'auth/clearUser' });
          await dispatch({ type: 'auth/clearUserExists' });
          await dispatch({ type: 'user/clearUserWallet' });
          await dispatch({ type: 'transaction/clearAllFundTransactions' });
          await dispatch({ type: 'user/clearCompanyInfo' });
          await dispatch({ type: 'user/clearUserSettings' });

          // Clear token from localStorage
          const { auth } = store.getState();
          const loggedInUser = auth.currentUser;
          if (loggedInUser?._id) {
            localStorage.removeItem(`userToken_${loggedInUser._id}`);
          }
          await persistor.purge();

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

// Export for manual initialization
export const initializeInterceptors = async (store, persistor) => {
  try {
    setupApiInterceptors(store, persistor);
  } catch (error) {
    console.error('Failed to initialize Axios interceptors:', error);
  }
};