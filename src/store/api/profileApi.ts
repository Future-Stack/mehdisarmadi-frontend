import { baseApi } from "./baseApi";
import { profileService } from "@/services/profile.service";
import type { User, ApiResponse } from "@/types";
import type { ProfileFormValues, PasswordChangeFormValues } from "@/schemas/profile.schema";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<User>, void>({
      queryFn: async () => {
        try {
          const result = await profileService.getProfile();
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, ProfileFormValues>({
      queryFn: async (payload) => {
        try {
          const result = await profileService.updateProfile(payload);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
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
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = profileApi;
