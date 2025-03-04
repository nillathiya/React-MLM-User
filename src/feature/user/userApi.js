import { apiClient } from '../../api/apiClient';
import { ROUTES } from '../../api/routes';
import { AxiosError } from 'axios';

export const registerNewUser = async (formData) => {
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

export const checkUsername = async (formData) => {
  try {
    const response = await apiClient.post(ROUTES.USER.CHECK_NAME, formData);
    const data = response.data;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('User Check Name failed. Please try again later.');
  }
};

export const getUserRankAndTeamMetrics = async () => {
  try {
    const response = await apiClient.post(ROUTES.USER.GET_USER_RANK_AND_TEAM_METRICS);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('Get User rank and Team Metrics failed. Please try again later.');
  }
};

export const getUserDirects = async () => {
  try {
    const response = await apiClient.post(ROUTES.USER.GET_DIRECTS);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('Get User directs failed. Please try again later.');
  }
};

export const getUserGenerationTree = async () => {
  try {
    const response = await apiClient.post(ROUTES.USER.GET_GENERATION_TREE);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'An error occurred.');
    }
    throw new Error('Get User generation failed. Please try again later.');
  }
};

export const getUserDetailsWithInvestmentInfo = async (formData, signal) => {
  try {
    const response = await apiClient.post(
      ROUTES.USER.GET_DETAILS_WITH_INVEST_INFO,
      formData,
      { signal }
    );
    return response.data;
  } catch (error) {
    if (error.name === "CanceledError") {
      console.log("Request canceled:", error.message);
      return;
    }

    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "An error occurred.");
    }

    throw new Error("Get user details with investment info failed. Please try again later.");
  }
};
