import { baseApi } from "@/store/api/baseApi";

interface DeleteUsersPayload {
  userIds: string[];
}

interface DeleteUsersResponse {
  success: boolean;
  message: string;
}

export const deleteUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteUsers: builder.mutation<
      DeleteUsersResponse,
      DeleteUsersPayload
    >({
      query: (body) => ({
        url: "/admin/users",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useDeleteUsersMutation } = deleteUsersApi;