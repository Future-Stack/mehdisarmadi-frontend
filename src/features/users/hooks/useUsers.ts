"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService, type GetUsersParams } from "@/services/users.service";
import { QUERY_KEYS } from "@/constants";
import type { CreateUserFormValues } from "@/schemas/user.schema";

// ─── Get paginated users ───────────────────────────────────────────────────

export function useGetUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => usersService.getUsers(params),
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  });
}

// ─── Get single user ──────────────────────────────────────────────────────

export function useGetUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
}

// ─── Create user ──────────────────────────────────────────────────────────

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserFormValues) =>
      usersService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success("User created successfully.");
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? "Failed to create user.");
    },
  });
}

// ─── Update user ──────────────────────────────────────────────────────────

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CreateUserFormValues>) =>
      usersService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, id] });
      toast.success("User updated successfully.");
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? "Failed to update user.");
    },
  });
}

// ─── Delete user ──────────────────────────────────────────────────────────

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success("User deleted.");
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? "Failed to delete user.");
    },
  });
}
