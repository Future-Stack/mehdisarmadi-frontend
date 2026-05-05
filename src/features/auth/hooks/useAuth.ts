"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { QUERY_KEYS, ROUTES } from "@/constants";
import type { LoginPayload, RegisterPayload } from "@/services/auth.service";
import { handleLoginAction, handleLogoutAction } from "../actions";

// ─── Current user ─────────────────────────────────────────────────────────

export function useGetMe() {
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Login ────────────────────────────────────────────────────────────────

export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (res) => {
      await handleLoginAction(res.data.user.id, res.data.user.role);
      dispatch(setCredentials({ user: res.data.user, tokens: res.data.tokens }));
      queryClient.setQueryData([QUERY_KEYS.USER], res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const redirectPath = res.data.user.role === "user" ? "/sub-user" : ROUTES.DASHBOARD;
      router.push(redirectPath);
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? "Login failed. Please try again.");
    },
  });
}

// ─── Register ─────────────────────────────────────────────────────────────

export function useRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: async (res) => {
      // await handleLoginAction(res.data.user.id, res.data.user.role);
      // dispatch(setCredentials({ user: res.data.user, tokens: res.data.tokens }));
      toast.success("Account created! Please login to continue.");
      router.push(ROUTES.LOGIN);
    },
    onError: (err: { message: string }) => {
      toast.error(err.message ?? "Registration failed. Please try again.");
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await handleLogoutAction();
      dispatch(clearCredentials());
      queryClient.clear();
      toast.success("You have been signed out.");
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // Always clear locally, even on network failure
      dispatch(clearCredentials());
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });
}
