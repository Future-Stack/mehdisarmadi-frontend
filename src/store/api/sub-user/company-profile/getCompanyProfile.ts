import { baseApi } from "@/store/api/baseApi";

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  hstNumber: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

interface GetCompanyProfileResponse {
  success: boolean;
  message: string;
  data: CompanyProfile;
}

export const getCompanyProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProfile: builder.query<
      GetCompanyProfileResponse,
      void
    >({
      query: () => ({
        url: "/user/company-profile",
        method: "GET",
      }),
      providesTags: ["CompanyProfile"],
    }),
  }),
});

export const {
  useGetCompanyProfileQuery,
} = getCompanyProfileApi;