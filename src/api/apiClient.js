import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Define apiClient first without interceptors
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Function to initialize interceptors with store access
const initializeInterceptors = async () => {
  const { store } = await import('../store/store'); // Dynamic import inside async function

  // Request Interceptor: Attach the correct user token
  apiClient.interceptors.request.use(
    (config) => {
      try {
        // Get the logged-in user from Redux store
        const { auth } = store.getState();
        const loggedInUser = auth.currentUser;

        if (loggedInUser) {
          // Read userToken from cookies
          const userToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`userToken_${loggedInUser._id}=`))
            ?.split('=')[1];

          console.log("userToken", userToken)
          if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
          }
        }
      } catch (error) {
        console.error('Error attaching token:', error);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor: Handle 401 errors
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          console.warn('Session expired, logging out user...');
          const { clearUser, clearUserExists, userLogoutAsync } = await import('../feature/auth/authSlice');
          const { clearUserWallet, clearCompanyInfo, clearUserSettings } = await import('../feature/user/userSlice');
          const { clearAllFundTransactions } = await import('../feature/transaction/transactionSlice');

          const dispatch = store.dispatch;

          // await Promise.all([
          //   dispatch(userLogoutAsync()),
          //   dispatch(clearUser()),
          //   dispatch(clearUserExists()),
          //   dispatch(clearUserWallet()),
          //   dispatch(clearAllFundTransactions()),
          //   dispatch(clearCompanyInfo()),
          //   dispatch(clearUserSettings()),
          // ]);

          // window.location.href = '/';
        } catch (err) {
          console.error('Error during 401 handling:', err);
          // window.location.href = '/'; // Fallback redirect
        }
      }

      return Promise.reject(error);
    },
  );
};

// Initialize interceptors immediately
initializeInterceptors().catch((error) => {
  console.error('Failed to initialize Axios interceptors:', error);
});