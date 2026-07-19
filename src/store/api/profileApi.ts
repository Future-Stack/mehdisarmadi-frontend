import { baseApi } from "./baseApi";
import { profileService } from "@/services/profile.service";
import type { User, ApiResponse } from "@/types";
import type { ProfileFormValues, PasswordChangeFormValues } from "@/schemas/profile.schema";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, Partial<ProfileFormValues>>({
      query: (payload) => ({
        url: "/user/profile-update",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<ApiResponse<void>, Omit<PasswordChangeFormValues, "confirmPassword">>({
      queryFn: async (payload) => {
        try {
          const result = await profileService.updatePassword(payload);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
    }),
    deleteAccount: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/user/account",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} = profileApi;
