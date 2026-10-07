import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
  type VerifyEmailPayload,
} from "@/services/auth.service";
import type { User, AuthTokens } from "@/types";
import { getRefreshTokenFromCookie, setAuthCookies } from "@/lib/axios";

export interface LoginThunkResponse {
  user: User;
  isFirstTimer: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterThunkResponse {
  user: {
    id: string;
    email: string;
    status: string;
    createdAt: string;
  };
}

export interface VerifyEmailThunkResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const registerThunk = createAsyncThunk<
  RegisterThunkResponse,
  RegisterPayload,
  {
    rejectValue: string;
  }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.register(payload);
    if (!response.success) {
      return rejectWithValue(response.message || "Registration failed");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Registration failed"
    );
  }
});

export const verifyEmailThunk = createAsyncThunk<
  VerifyEmailThunkResponse,
  VerifyEmailPayload,
  {
    rejectValue: string;
  }
>("auth/verify-email", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.verifyEmail(payload);
    if (!response.success) {
      return rejectWithValue(response.message || "Email verification failed");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Email verification failed"
    );
  }
});

export const loginThunk = createAsyncThunk<
  LoginThunkResponse,
  LoginPayload,
  {
    rejectValue: string;
  }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.login(payload);
    if (!response.success) {
      return rejectWithValue(response.message || "Login failed");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Login failed"
    );
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
  }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.logout();
    if (!response.success) {
      return rejectWithValue(response.message || "Logout failed");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Logout failed"
    );
  }
});

export const refreshTokenThunk = createAsyncThunk<
  AuthTokens,
  string | undefined,
  {
    rejectValue: string;
  }
>("auth/refreshToken", async (tokenArg, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth?: { refreshToken?: string | null } };
    const token =
      tokenArg ||
      state?.auth?.refreshToken ||
      getRefreshTokenFromCookie();

    if (!token) {
      return rejectWithValue("No refresh token available");
    }

    const response = await authService.refreshToken(token);
    if (!response.success || !response.data) {
      return rejectWithValue(response.message || "Token refresh failed");
    }

    setAuthCookies(response.data.accessToken, response.data.refreshToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Token refresh failed"
    );
  }
});

