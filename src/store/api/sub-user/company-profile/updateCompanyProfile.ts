import { baseApi } from "@/store/api/baseApi";
import { CompanyProfile } from "./getCompanyProfile";

export interface UpdateCompanyProfilePayload {
  name: string;
  address: string;
  phone: string;
  email: string;
  hstNumber: string;
  website: string;
  logo?: File;
}

interface UpdateCompanyProfileResponse {
  success: boolean;
  message: string;
  data: CompanyProfile;
}

export const updateCompanyProfileApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      updateCompanyProfile: builder.mutation<
        UpdateCompanyProfileResponse,
        UpdateCompanyProfilePayload
      >({
        query: (payload) => {
          const formData = new FormData();

          formData.append("name", payload.name);
          formData.append("address", payload.address);
          formData.append("phone", payload.phone);
          formData.append("email", payload.email);
          formData.append(
            "hstNumber",
            payload.hstNumber
          );
          formData.append(
            "website",
            payload.website
          );

          if (payload.logo) {
            formData.append("logo", payload.logo);
          }

          return {
            url: "/user/company-profile",
            method: "PATCH",
            body: formData,
          };
        },
        invalidatesTags: ["CompanyProfile"],
      }),
    }),
  });

export const {
  useUpdateCompanyProfileMutation,
} = updateCompanyProfileApi;