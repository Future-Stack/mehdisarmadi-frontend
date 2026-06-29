import { baseApi } from "@/store/api/baseApi";

interface UsersCountResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
  };
}

export const getUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsersCount: builder.query<UsersCountResponse, void>({
      query: () => ({
        url: "/admin/users/count",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersCountQuery } = getUsersApi;