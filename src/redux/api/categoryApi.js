import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const CATEGORY_URL = "/category";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        categories: build.query({
            query: (arg) => ({
                url: CATEGORY_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response, meta) => {
                return {
                    categories: response.data,
                    meta,
                };
            },
            providesTags: [tagTypes.category],
        }),

        addCategory: build.mutation({
            query: (data) => ({
                url: CATEGORY_URL,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.category],
        }),

        category: build.query({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.category],
        }),

        updateCategory: build.mutation({
            query: (data) => ({
                url: `${CATEGORY_URL}/${data.id}`,
                method: "PATCH",
                data: data.body,
            }),
            invalidatesTags: [tagTypes.category],
        }),

        deleteCategory: build.mutation({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.category],
        }),
    }),
});

export const {
    useCategoriesQuery,
    useCategoryQuery,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
} = categoryApi;
