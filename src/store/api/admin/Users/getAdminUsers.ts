import { baseApi } from "@/store/api/baseApi";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "active" | "suspended";
  isEmailVerified: boolean;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetAdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: AdminUser[];
  };
}

export const getAdminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<
      GetAdminUsersResponse,
      GetAdminUsersParams
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/admin/users",
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetAdminUsersQuery } = getAdminUsersApi;