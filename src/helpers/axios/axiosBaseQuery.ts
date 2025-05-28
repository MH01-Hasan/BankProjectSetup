import { instance as axiosInstance } from "./axiosInstance";

export const axiosBaseQuery = ({ baseUrl } = { baseUrl: "" }) => {
  return async ({ url, method, data, params, contentType }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          contentType: contentType || "application/json",
        },
        withCredentials: true,
      });

      return result;
    } catch (error) {
      return {
        error: {
          status: error?.response?.status,
          data: error?.response?.data || error.message,
        },
      };
    }
  };
};
