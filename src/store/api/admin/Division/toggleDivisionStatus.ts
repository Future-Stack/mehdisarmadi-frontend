import { baseApi } from "@/store/api/baseApi";
import { Division } from "./getDivision";

interface ToggleDivisionStatusResponse {
  success: boolean;
  message: string;
  data: Division;
}

export const toggleDivisionStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enableDivision: builder.mutation<ToggleDivisionStatusResponse, string>({
      query: (id) => ({
        url: `admin/divisions/${id}/enable`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Division",
        { type: "Division", id },
      ],
    }),
    disableDivision: builder.mutation<ToggleDivisionStatusResponse, string>({
      query: (id) => ({
        url: `admin/divisions/${id}/disable`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Division",
        { type: "Division", id },
      ],
    }),
  }),
});

export const { useEnableDivisionMutation, useDisableDivisionMutation } = toggleDivisionStatusApi;