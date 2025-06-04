import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const PRODUCT_URL = "/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    products: build.query({
      query: (arg) => ({
        url: PRODUCT_URL,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response, meta) => {
        return {
          products: response.data,
          meta,
        };
      },
      providesTags: [tagTypes.product],
    }),

    addProduct: build.mutation({
      query: (data) => ({
        url: PRODUCT_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    product: build.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    updateProduct: build.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const {
  useProductsQuery,
  useProductQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
