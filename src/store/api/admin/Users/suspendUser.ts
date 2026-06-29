import { baseApi } from "@/store/api/baseApi";

interface SuspendUserResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: "ADMIN" | "USER";
      status: string;
      isEmailVerified: boolean;
      updatedAt: string;
    };
  };
}

export const suspendUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    suspendUser: builder.mutation<SuspendUserResponse, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}/suspend`,
        method: "PUT",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useSuspendUserMutation } = suspendUserApi;