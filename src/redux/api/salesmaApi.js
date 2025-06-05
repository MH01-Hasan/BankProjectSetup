import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const SALESMAN_URL = "/salesman";

export const salesmanApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        salesmen: build.query({
            query: (arg) => ({
                url: SALESMAN_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response, meta) => {
                return {
                    salesmen: response.data,
                    meta,
                };
            },
            providesTags: [tagTypes.salesman],
        }),

        addSalesman: build.mutation({
            query: (data) => ({
                url: SALESMAN_URL,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.salesman],
        }),

        salesman: build.query({
            query: (id) => ({
                url: `${SALESMAN_URL}/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.salesman],
        }),

        updateSalesman: build.mutation({
            query: (data) => ({
                url: `${SALESMAN_URL}/${data.id}`,
                method: "PATCH",
                data: data.body,
            }),
            invalidatesTags: [tagTypes.salesman],
        }),

        deleteSalesman: build.mutation({
            query: (id) => ({
                url: `${SALESMAN_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.salesman],
        }),
    }),
});

export const {
    useSalesmenQuery,
    useSalesmanQuery,
    useAddSalesmanMutation,
    useDeleteSalesmanMutation,
    useUpdateSalesmanMutation,
} = salesmanApi;
