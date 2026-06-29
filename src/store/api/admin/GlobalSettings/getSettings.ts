import { baseApi } from "@/store/api/baseApi";

export interface GlobalSettings {
  id: string;
  companyName: string;
  labourRate: number;
  profitMargin: number;
  bondPercentage: number;
  standardExclusions: string[];
  standardAssumptions: string[];
  createdAt: string;
  updatedAt: string;
}

interface GetGlobalSettingsResponse {
  success: boolean;
  message: string;
  data: GlobalSettings;
}

export const getGlobalSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalSettings: builder.query<GetGlobalSettingsResponse, void>({
      query: () => ({
        url: "/admin/global-settings",
        method: "GET",
      }),
      providesTags: ["GlobalSettings"],
    }),
  }),
});

export const { useGetGlobalSettingsQuery } = getGlobalSettingsApi;