import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const verifyTransaction = async (formData) => {
    try {
        const response = await apiClient.post(
            ROUTES.TRANSACTION.VERIFY,
            formData,
        );
        return response.data;
    } catch (error) {
        console.log("error",error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Change password failed. Please try again later.');
    }
};
