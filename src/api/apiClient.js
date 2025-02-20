import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // console.log("error", error);
    // Handle 401 Unauthorized errors (e.g., session expiration)
    if (error.response && error.response.status === 401) {
      alert('Your session has expired. Please log in again.');

      try {
        // // Lazy-load store and actions to prevent circular dependencies
        // const { store } = await import('../store/store');
        // const { adminLogoutAsync, clearUser } = await import('../features/auth/authSlice');

        // await store.dispatch(adminLogoutAsync());
        // await store.dispatch(clearUser());

        // window.location.href = '/';
      } catch (err) {
        console.error('Error during 401 handling:', err);
      }
    }

    // Reject the promise with the error
    return Promise.reject(error);
  },
);
