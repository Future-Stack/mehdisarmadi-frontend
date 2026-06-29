import { baseApi } from "@/store/api/baseApi";
import { Division } from "./getDivision";


interface GetDivisionResponse {
  success: boolean;
  message: string;
  data: Division;
}

export const getDivisionIdApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDivisionById: builder.query<GetDivisionResponse, string>({
      query: (id) => ({
        url: `admin/divisions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Division", id },
      ],
    }),
  }),
});

export const { useGetDivisionByIdQuery } = getDivisionIdApi;