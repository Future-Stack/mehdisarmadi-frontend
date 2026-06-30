import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { fetchUsersThunk, fetchUserByIdThunk, deleteUserThunk } from "./usersThunks";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
        state.totalCount = action.payload.length;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch users";
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch user";
      });

    // Delete User
    builder
      .addCase(deleteUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.totalCount = state.users.length;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete user";
      });
  },
});

export const { clearError, clearSelectedUser } = usersSlice.actions;

export default usersSlice.reducer;
