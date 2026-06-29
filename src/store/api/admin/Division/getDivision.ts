import { baseApi } from "@/store/api/baseApi";

export interface Division {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetDivisionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetDivisionsResponse {
  success: boolean;
  message: string;
  data: {
    items: Division[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getDivisionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDivisions: builder.query<
      GetDivisionsResponse,
      GetDivisionsParams | undefined
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};

        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;

        if (params?.search?.trim()) {
          queryParams.search = params.search.trim();
        }

        return {
          url: "admin/divisions",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Division"],
    }),
  }),
});

export const { useGetDivisionsQuery } = getDivisionsApi;