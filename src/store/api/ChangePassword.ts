import { baseApi } from "@/store/api/baseApi";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

export const changePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordPayload
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } =
  changePasswordApi;