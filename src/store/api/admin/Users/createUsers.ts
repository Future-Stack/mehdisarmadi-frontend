import { baseApi } from "@/store/api/baseApi";

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
      status: string;
      isEmailVerified: boolean;
      createdAt: string;
    };
  };
}

export const createUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<
      CreateUserResponse,
      CreateUserPayload
    >({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useCreateUserMutation } = createUserApi;