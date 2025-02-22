import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const registerNewUser = async (formData)=> {
  try {
    const response = await apiClient.post(ROUTES.USER.REGISTER, formData);
    const data = response.data;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('User Add failed. Please try again later.');
  }
};

export const checkUsername = async (formData)=> {
  try {
    const response = await apiClient.post(ROUTES.USER.CHECK_NAME,formData);
    const data = response.data;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('User Check Name failed. Please try again later.');
  }
};



