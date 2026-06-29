import { baseApi } from "@/store/api/baseApi";
import { Profile } from "./getProfile";

export interface UpdateProfilePayload {
  fullName: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

export const updateProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: "/user/profile-update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useUpdateProfileMutation } = updateProfileApi;