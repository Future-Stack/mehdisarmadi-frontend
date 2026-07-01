import { baseApi } from "./baseApi";
import type {
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  LoginResponse,
  RegisterResponse,
  VerifyEmailResponse,
} from "@/services/auth.service";
import type { ApiResponse, User } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifyEmail: builder.mutation<ApiResponse<VerifyEmailResponse>, VerifyEmailPayload>({
      query: (payload) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    login: builder.mutation<ApiResponse<LoginResponse>, LoginPayload>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    adminLogin: builder.mutation<ApiResponse<LoginResponse>, LoginPayload>({
      query: (payload) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    getMe: builder.query<ApiResponse<User>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    refreshToken: builder.mutation<ApiResponse<{ accessToken: string }>, string>({
      query: (refreshToken) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
      invalidatesTags: ["Auth"],
    }),

    passwordResetSendCode: builder.mutation<ApiResponse<any>, { email: string }>({
      query: (payload) => ({
        url: "/auth/password-reset/send-code",
        method: "POST",
        body: payload,
      }),
    }),

    passwordResetVerifyCode: builder.mutation<ApiResponse<{ token: string }>, { email: string; code: string }>({
      query: (payload) => ({
        url: "/auth/password-reset/verify-code",
        method: "POST",
        body: payload,
      }),
    }),

    passwordResetConfirm: builder.mutation<ApiResponse<any>, { token: string; newPassword: string }>({
      query: (payload) => ({
        url: "/auth/password-reset/confirm",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useAdminLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  usePasswordResetSendCodeMutation,
  usePasswordResetVerifyCodeMutation,
  usePasswordResetConfirmMutation,
} = authApi;
