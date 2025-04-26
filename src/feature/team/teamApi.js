import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const getUserTeamDetails = async (userId) => {
    try {
        const response = await apiClient.post(
            ROUTES.TEAM.USER_TEAM_DETAILS,
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred.');
        }
        throw new Error('Get User wallet failed. Please try again later.');
    }
};