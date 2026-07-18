import { baseApi } from "@/store/api/baseApi";
import { Division, FocusLevel } from "./getDivision";

export interface CreateDivisionPayload {
  code: string;
  name: string;
  description: string;
  isEnabled: boolean;
  focusLevel: FocusLevel;
  keywords: string[];
  tradeMappings: string[];
}

interface CreateDivisionResponse {
  success: boolean;
  message: string;
  data: Division;
}

export const postDivisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDivision: builder.mutation<CreateDivisionResponse, CreateDivisionPayload>({
      query: (body) => ({
        url: "admin/divisions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Division"],
    }),
  }),
});

export const { useCreateDivisionMutation } = postDivisionApi;

// import { baseApi } from "@/store/api/baseApi";
// import { Division } from "./getDivision";


// export interface CreateDivisionPayload {
//   code: string;
//   name: string;
//   description: string;
// }

// interface CreateDivisionResponse {
//   success: boolean;
//   message: string;
//   data: Division;
// }

// export const postDivisionApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     createDivision: builder.mutation<
//       CreateDivisionResponse,
//       CreateDivisionPayload
//     >({
//       query: (body) => ({
//         url: "admin/divisions",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Division"],
//     }),
//   }),
// });

// export const { useCreateDivisionMutation } = postDivisionApi;