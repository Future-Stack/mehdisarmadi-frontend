import { baseApi } from "@/store/api/baseApi";
import { GlobalSettings } from "./getSettings";


export interface UpdateGlobalSettingsPayload {
  companyName: string;
  labourRate: number;
  profitMargin: number;
  bondPercentage: number;
  standardExclusions: string[];
  standardAssumptions: string[];
}

interface UpdateGlobalSettingsResponse {
  success: boolean;
  message: string;
  data: GlobalSettings;
}

export const updateGlobalSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateGlobalSettings: builder.mutation<
      UpdateGlobalSettingsResponse,
      UpdateGlobalSettingsPayload
    >({
      query: (body) => ({
        url: "/admin/global-settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["GlobalSettings"],
    }),
  }),
});

export const { useUpdateGlobalSettingsMutation } =
  updateGlobalSettingsApi;