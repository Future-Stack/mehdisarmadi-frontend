import { baseApi } from "@/store/api/baseApi";
import { Division } from "./getDivision";


export interface UpdateDivisionPayload {
  id: string;
  code: string;
  name: string;
  description: string;
}

interface UpdateDivisionResponse {
  success: boolean;
  message: string;
  data: Division;
}

export const updateDivisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateDivision: builder.mutation<
      UpdateDivisionResponse,
      UpdateDivisionPayload
    >({
      query: ({ id, ...body }) => ({
        url: `admin/divisions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Division",
        { type: "Division", id },
      ],
    }),
  }),
});

export const { useUpdateDivisionMutation } = updateDivisionApi;