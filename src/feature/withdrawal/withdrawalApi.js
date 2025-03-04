import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const userFundWithdrawal = async (formData) => {
    try {
        const response = await apiClient.post(
            ROUTES.WITHDRAWAL.CREATE_REQUEST, formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('User Fund withdrawal failed. Please try again later.');
    }
};

export const fetchUserFundWithdrawalHistory = async () => {
    try {
        const response = await apiClient.post(
            ROUTES.WITHDRAWAL.GET_USER_FUND_WITHDRAWAL);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Fund withdrawal failed. Please try again later.');
    }
};




