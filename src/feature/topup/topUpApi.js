import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const getPinDetails = async (userId) => {
    try {
        const response = await apiClient.post(
            ROUTES.PIN_DETAILS.GET_ALL,);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get pin detail failed. Please try again later.');
    }
};


export const createTopUp = async (formData) => {
    try {
        const response = await apiClient.post(
            ROUTES.TOPUP.CREATE, formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Create TopUp failed. Please try again later.');
    }
};

