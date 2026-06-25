import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProjectsThunk,
  fetchProjectByIdThunk,
  createProjectThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from "./projectsThunks";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedProject(state) {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Projects
    builder
      .addCase(fetchProjectsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch projects";
      });

    // Fetch Project By ID
    builder
      .addCase(fetchProjectByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectByIdThunk.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchProjectByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch project";
      });

    // Create Project
    builder
      .addCase(createProjectThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create project";
      });

    // Update Project
    builder
      .addCase(updateProjectThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectThunk.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.selectedProject = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update project";
      });

    // Delete Project
    builder
      .addCase(deleteProjectThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteProjectThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete project";
      });
  },
});

export const { clearError, clearSelectedProject } = projectsSlice.actions;

export default projectsSlice.reducer;
