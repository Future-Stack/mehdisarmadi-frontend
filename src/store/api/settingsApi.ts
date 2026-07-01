import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types";

export interface AiRules {
  id?: string;
  userId?: string;
  generalInstructions: string;
  pricingSpecificInstructions: string;
  scopeAnalysisInstructions: string;
  defaultAssumptions: string;
  defaultExclusions: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationSettingsData {
  id?: string;
  userId?: string;
  processingComplete: boolean;
  processingFailed: boolean;
  quoteExported: boolean;
  addendaUploaded: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiRules: builder.query<ApiResponse<AiRules>, void>({
      query: () => "/user/ai-rules",
      providesTags: ["Settings"],
    }),
    updateAiRules: builder.mutation<ApiResponse<AiRules>, Partial<AiRules>>({
      query: (payload) => ({
        url: "/user/ai-rules",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Settings"],
    }),
    getNotificationSettings: builder.query<ApiResponse<NotificationSettingsData>, void>({
      query: () => "/user/notification-settings",
      providesTags: ["Settings"],
    }),
    updateNotificationSettings: builder.mutation<ApiResponse<NotificationSettingsData>, Partial<NotificationSettingsData>>({
      query: (payload) => ({
        url: "/user/notification-settings",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiRulesQuery,
  useUpdateAiRulesMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = settingsApi;
