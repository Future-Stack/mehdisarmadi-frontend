"use client";

import { toast } from "sonner";
import type { GetUsersParams } from "@/services/users.service";
import type { CreateUserFormValues } from "@/schemas/user.schema";
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/api/usersApi";

// ─── Get paginated users ───────────────────────────────────────────────────

export function useGetUsers(params: GetUsersParams = {}) {
  return useGetUsersQuery(params);
}

// ─── Get single user ──────────────────────────────────────────────────────

export function useGetUser(id: string) {
  return useGetUserByIdQuery(id, { skip: !id });
}

// ─── Create user ──────────────────────────────────────────────────────────

export function useCreateUser() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const mutate = async (payload: CreateUserFormValues) => {
    try {
      const response = await createUser(payload).unwrap();
      toast.success("User created successfully.");
      return response;
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create user.");
      throw err;
    }
  };

  return { mutate, isPending: isLoading };
}

// ─── Update user ──────────────────────────────────────────────────────────

export function useUpdateUser(id: string) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const mutate = async (payload: Partial<CreateUserFormValues>) => {
    try {
      const response = await updateUser({ id, payload }).unwrap();
      toast.success("User updated successfully.");
      return response;
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update user.");
      throw err;
    }
  };

  return { mutate, isPending: isLoading };
}

// ─── Delete user ──────────────────────────────────────────────────────────

export function useDeleteUser() {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const mutate = async (id: string) => {
    try {
      const response = await deleteUser(id).unwrap();
      toast.success("User deleted.");
      return response;
    } catch (err: any) {
      toast.error(err.message ?? "Failed to delete user.");
      throw err;
    }
  };

  return { mutate, isPending: isLoading };
}
