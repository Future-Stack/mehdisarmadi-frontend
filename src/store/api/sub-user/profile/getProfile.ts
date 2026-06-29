import { baseApi } from "@/store/api/baseApi";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  status: "active" | "suspended";
  isEmailVerified: boolean;
  verificationCode: string | null;
  verificationCodeExpiry: string | null;
  refreshToken: string;
  fcmTokens: string[];
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

interface GetProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;