import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const getUserOrders = async (userId) => {
    try {
        const response = await apiClient.post(
            ROUTES.ORDERS.GET_BY_USER,
            { userId },
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Order failed. Please try again later.');
    }
};


