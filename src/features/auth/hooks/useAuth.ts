"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, clearCredentials, setRegistrationEmail } from "@/store/slices/authSlice";
import { ROUTES } from "@/constants";
import {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useAdminLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} from "@/store/api/authApi";
import { handleLoginAction, handleLogoutAction } from "../actions";

// ─── Login ────────────────────────────────────────────────────────────────

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  return {
    login: async (email: string, password: string) => {
      try {
        const result = await login({ email, password }).unwrap();
        await handleLoginAction(result.data.user.id, result.data.user.role);
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          })
        );
        toast.success(`Welcome back, ${result.data.user.fullName || result.data.user.name}!`);
        const redirectPath =
          result.data.user.role === "USER" ? "/sub-user" : ROUTES.DASHBOARD;
        router.push(redirectPath);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Login failed. Please try again.";
        toast.error(errorMsg);
        throw err;
      }
    },
    isLoading,
    error,
  };
}

// ─── Admin Login ──────────────────────────────────────────────────────────

export function useAdminLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [adminLogin, { isLoading, error }] = useAdminLoginMutation();

  return {
    adminLogin: async (email: string, password: string) => {
      try {
        const result = await adminLogin({ email, password }).unwrap();
        await handleLoginAction(result.data.user.id, result.data.user.role);
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          })
        );
        toast.success(`Welcome back, ${result.data.user.fullName || result.data.user.name}!`);
        router.push(ROUTES.DASHBOARD);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Admin login failed. Please try again.";
        toast.error(errorMsg);
        throw err;
      }
    },
    isLoading,
    error,
  };
}

// ─── Register ─────────────────────────────────────────────────────────────

export function useRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  return {
    register: async (fullName: string, email: string, password: string) => {
      try {
        const result = await register({ fullName, email, password }).unwrap();
        dispatch(setRegistrationEmail(result.data.user.email));
        toast.success("Account created! Please check your email for verification code.");
        router.push(`/verify-email?email=${encodeURIComponent(result.data.user.email)}`);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Registration failed. Please try again.";
        toast.error(errorMsg);
        throw err;
      }
    },
    isLoading,
    error,
  };
}

// ─── Verify Email ─────────────────────────────────────────────────────────

export function useVerifyEmail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [verifyEmail, { isLoading, error }] = useVerifyEmailMutation();

  return {
    verifyEmail: async (email: string, code: string) => {
      try {
        const result = await verifyEmail({ email, code }).unwrap();
        await handleLoginAction(result.data.user.id, result.data.user.role);
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          })
        );
        toast.success("Email verified successfully!");
        const redirectPath =
          result.data.user.role === "USER" ? "/sub-user" : ROUTES.DASHBOARD;
        router.push(redirectPath);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Email verification failed. Please try again.";
        toast.error(errorMsg);
        throw err;
      }
    },
    isLoading,
    error,
  };
}

// ─── Logout ───────────────────────────────────────────────────────────────

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  return {
    logout: async () => {
      try {
        await logout().unwrap();
        toast.success("You have been signed out.");
      } catch {
        // Ignore API errors for logout, we still want to log them out locally
      } finally {
        // Always clear cookie and local state, even on network failure
        await handleLogoutAction();
        dispatch(clearCredentials());
        router.push(ROUTES.LOGIN);
      }
    },
    isLoading,
  };
}

// ─── Get Current User ─────────────────────────────────────────────────────

export function useGetMe() {
  return useGetMeQuery();
}
