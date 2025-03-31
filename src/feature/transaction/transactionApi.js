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
        console.log("error", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Change password failed. Please try again later.');
    }
};


export const getTransactionsByUser = async () => {
    try {
        const response = await apiClient.post(
            ROUTES.TRANSACTION.GET_BY_USER);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Transaction failed. Please try again later.');
    }
};

export const getFundTransactionsByUser = async () => {
    try {
        const response = await apiClient.post(
            ROUTES.TRANSACTION.FUND.GET_BY_USER);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Fund Transaction failed. Please try again later.');
    }
};

export const getIncomeTransactionsByUser = async ({ source }) => {
    try {
        const response = await apiClient.post(
            ROUTES.TRANSACTION.INCOME.GET_BY_USER(source));
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Fund Transaction failed. Please try again later.');
    }
};


export const userFundTransfer = async (formData) => {
    try {
        const response = await apiClient.post(
            ROUTES.TRANSACTION.FUND.TRANSFER, formData);
        return response.data;
    } catch (error) {
        console.log("error", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Fund Transfer failed. Please try again later.');
    }
};

export const userConvertFunds = async (formData) => {
    try {
        const response = await apiClient.post(
            ROUTES.TRANSACTION.FUND.CONVERT, formData);
        return response.data;
    } catch (error) {
        console.log("error", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User Fund Convert failed. Please try again later.');
    }
};

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


