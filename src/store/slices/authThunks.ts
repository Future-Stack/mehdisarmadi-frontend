import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService, type LoginPayload, type RegisterPayload, type AuthResponse } from "@/services/auth.service";
import type { ApiResponse } from "@/types";

export const loginThunk = createAsyncThunk<
  AuthResponse,
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

export const registerThunk = createAsyncThunk<
  AuthResponse,
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
  string,
  string,
  {
    rejectValue: string;
  }
>("auth/refreshToken", async (refreshToken, { rejectWithValue }) => {
  try {
    const response = await authService.refreshToken(refreshToken);
    if (!response.success) {
      return rejectWithValue(response.message || "Token refresh failed");
    }
    return response.data.accessToken;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Token refresh failed"
    );
  }
});
