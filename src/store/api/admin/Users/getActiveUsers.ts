import { baseApi } from "@/store/api/baseApi";

interface ActiveUsersCountResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
  };
}

export const getActiveUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveUsersCount: builder.query<ActiveUsersCountResponse, void>({
      query: () => ({
        url: "/admin/users/active-count",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetActiveUsersCountQuery } = getActiveUsersApi;