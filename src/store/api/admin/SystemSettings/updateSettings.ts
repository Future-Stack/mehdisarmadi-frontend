import { baseApi } from "@/store/api/baseApi";
import { SystemSettings } from "./getSettings";

export interface UpdateSystemSettingsPayload {
  api_key: string;
  model_name: string;
  upload_size: number;
}

interface UpdateSystemSettingsResponse {
  success: boolean;
  message: string;
  data: {
    systemSettings: SystemSettings;
    ai_response: {
      status: string;
      api_key_set: boolean;
      model_name: string;
      upload_size: number;
      upload_size_mb: number;
    };
  };
}

export const updateSystemSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSystemSettings: builder.mutation<
      UpdateSystemSettingsResponse,
      UpdateSystemSettingsPayload
    >({
      query: (body) => ({
        url: "/admin/system-settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SystemSettings"],
    }),
  }),
});

export const {
  useUpdateSystemSettingsMutation,
} = updateSystemSettingsApi;