import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const userLogin = async (formData) => {
  try {
    const response = await apiClient.post(ROUTES.AUTH.USER_WALLET, formData);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('Sign-up failed. Please try again later.');
  }
};

export const checkWallet = async (formData) => {
  try {
    const response = await apiClient.post(ROUTES.AUTH.CHECK_WALLET, formData);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('Check user wallet failed. Please try again later.');
  }
};

export const verifyTokenLogin = async (token) => {
  try {
    const response = await apiClient.post(ROUTES.AUTH.CHECK_TOKEN, { token });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('User login failed. Please try again later.');
  }
};

