import { baseApi } from "./baseApi";
import { usersService, type GetUsersParams } from "@/services/users.service";
import type { User, ApiResponse, PaginatedResponse } from "@/types";
import type { CreateUserFormValues } from "@/schemas/user.schema";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, GetUsersParams>({
      queryFn: async (params) => {
        try {
          const result = await usersService.getUsers(params);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      queryFn: async (id) => {
        try {
          const result = await usersService.getUserById(id);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<ApiResponse<User>, CreateUserFormValues>({
      queryFn: async (payload) => {
        try {
          const result = await usersService.createUser(payload);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; payload: Partial<CreateUserFormValues> }
    >({
      queryFn: async ({ id, payload }) => {
        try {
          const result = await usersService.updateUser(id, payload);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      queryFn: async (id) => {
        try {
          const result = await usersService.deleteUser(id);
          return { data: result };
        } catch (error: any) {
          return { error: error?.response?.data || error };
        }
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
