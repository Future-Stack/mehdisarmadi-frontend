import { baseApi } from "@/store/api/baseApi";

export interface SystemSettings {
  id: string | null;
  api_key: string;
  model_name: string;
  upload_size: number;
  created_at: string | null;
  updated_at: string | null;
}

interface GetSystemSettingsResponse {
  success: boolean;
  message: string;
  data: SystemSettings;
}

export const getSystemSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemSettings: builder.query<
      GetSystemSettingsResponse,
      void
    >({
      query: () => ({
        url: "/admin/system-settings",
        method: "GET",
      }),
      providesTags: ["SystemSettings"],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
} = getSystemSettingsApi;