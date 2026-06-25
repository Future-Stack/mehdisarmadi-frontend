import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthTokens } from "@/types";
import { loginThunk, registerThunk, logoutThunk, refreshTokenThunk } from "./authThunks";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // true until we've checked session
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; tokens: AuthTokens }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
      });

    // Refresh Token
    builder
      .addCase(refreshTokenThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Token refresh failed";
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { setCredentials, setUser, clearCredentials, setAuthLoading, clearError } =
  authSlice.actions;

export default authSlice.reducer;
