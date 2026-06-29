import { baseApi } from "@/store/api/baseApi";

interface DeleteDivisionResponse {
  success: boolean;
  message: string;
}

export const deleteDivisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteDivision: builder.mutation<DeleteDivisionResponse, string>({
      query: (id) => ({
        url: `admin/divisions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Division",
        { type: "Division", id },
      ],
    }),
  }),
});

export const { useDeleteDivisionMutation } = deleteDivisionApi;