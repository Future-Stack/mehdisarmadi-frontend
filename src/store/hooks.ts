import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from ".";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  refreshTokenThunk,
  verifyEmailThunk,
} from "./slices/authThunks";
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  deleteUserThunk,
} from "./slices/usersThunks";
import {
  fetchProjectsThunk,
  fetchProjectByIdThunk,
  createProjectThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from "./slices/projectsThunks";

// ─── Base typed hooks ────────────────────────────────────────────────────────

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);

// ─── Auth hooks ─────────────────────────────────────────────────────────────

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  return {
    register: (fullName: string, email: string, password: string) =>
      dispatch(registerThunk({ fullName, email, password })),
    verifyEmail: (email: string, code: string) =>
      dispatch(verifyEmailThunk({ email, code })),
    login: (email: string, password: string) =>
      dispatch(loginThunk({ email, password })),
    logout: () => dispatch(logoutThunk()),
    refreshToken: (refreshToken: string) =>
      dispatch(refreshTokenThunk(refreshToken)),
  };
};

export const useAuthState = () =>
  useAppSelector((state) => ({
    user: state.auth.user,
    accessToken: state.auth.accessToken,
    refreshToken: state.auth.refreshToken,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    registrationEmail: state.auth.registrationEmail,
  }));

// ─── Users hooks ────────────────────────────────────────────────────────────

export const useUsersActions = () => {
  const dispatch = useAppDispatch();
  return {
    fetchUsers: (page?: number, limit?: number) =>
      dispatch(fetchUsersThunk({ page, limit })),
    fetchUserById: (userId: string) =>
      dispatch(fetchUserByIdThunk(userId)),
    deleteUser: (userId: string) =>
      dispatch(deleteUserThunk(userId)),
  };
};

export const useUsersState = () =>
  useAppSelector((state) => ({
    users: state.users.users,
    selectedUser: state.users.selectedUser,
    isLoading: state.users.isLoading,
    error: state.users.error,
    totalCount: state.users.totalCount,
  }));

// ─── Projects hooks ─────────────────────────────────────────────────────────

export const useProjectsActions = () => {
  const dispatch = useAppDispatch();
  return {
    fetchProjects: () => dispatch(fetchProjectsThunk()),
    fetchProjectById: (projectId: string) =>
      dispatch(fetchProjectByIdThunk(projectId)),
    createProject: (name: string, description: string) =>
      dispatch(createProjectThunk({ name, description })),
    updateProject: (
      id: string,
      updates: { name?: string; description?: string; status?: string }
    ) => dispatch(updateProjectThunk({ id, ...updates })),
    deleteProject: (projectId: string) =>
      dispatch(deleteProjectThunk(projectId)),
  };
};

export const useProjectsState = () =>
  useAppSelector((state) => ({
    projects: state.projects.projects,
    selectedProject: state.projects.selectedProject,
    isLoading: state.projects.isLoading,
    error: state.projects.error,
  }));
