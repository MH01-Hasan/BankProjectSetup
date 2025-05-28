import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: loginData,
        params: undefined,
        contentType: "application/json",
      }),
      invalidatesTags: [tagTypes.auth],
    }),
  }),
});

export const { useUserLoginMutation } = authApi;
