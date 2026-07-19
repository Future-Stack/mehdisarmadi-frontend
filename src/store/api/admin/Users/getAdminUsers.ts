import { baseApi } from "@/store/api/baseApi";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "active" | "pending" | "suspend";
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
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminUsers: builder.query<
      GetAdminUsersResponse,
      GetAdminUsersParams
    >({
      query: (params) => {
        const cleanParams: Record<string, any> = {};
        if (params.page) cleanParams.page = params.page;
        if (params.limit) cleanParams.limit = params.limit;
        if (params.search?.trim()) cleanParams.search = params.search.trim();

        return {
          url: "/admin/users",
          method: "GET",
          params: cleanParams,
        };
      },
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetAdminUsersQuery } = getAdminUsersApi;