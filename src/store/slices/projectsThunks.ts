import { createAsyncThunk } from "@reduxjs/toolkit";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectPayload {
  name: string;
  description: string;
}

interface UpdateProjectPayload {
  id: string;
  name?: string;
  description?: string;
  status?: string;
}

// Mock service (replace with actual API service)
const projectsService = {
  getProjects: async () => ({
    success: true,
    data: [] as Project[],
  }),
  getProjectById: async (id: string) => ({
    success: true,
    data: { id } as Project,
  }),
  createProject: async (payload: CreateProjectPayload) => ({
    success: true,
    data: { id: "new-id", ...payload, status: "active" } as Project,
  }),
  updateProject: async (payload: UpdateProjectPayload) => ({
    success: true,
    data: payload as unknown as Project,
  }),
  deleteProject: async (id: string) => ({
    success: true,
    data: id,
  }),
};

export const fetchProjectsThunk = createAsyncThunk<
  Project[],
  void,
  {
    rejectValue: string;
  }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const response = await projectsService.getProjects();
    if (!response.success) {
      return rejectWithValue("Failed to fetch projects");
    }
    return response.data || [];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch projects"
    );
  }
});

export const fetchProjectByIdThunk = createAsyncThunk<
  Project,
  string,
  {
    rejectValue: string;
  }
>("projects/fetchProjectById", async (projectId, { rejectWithValue }) => {
  try {
    const response = await projectsService.getProjectById(projectId);
    if (!response.success) {
      return rejectWithValue("Failed to fetch project");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch project"
    );
  }
});

export const createProjectThunk = createAsyncThunk<
  Project,
  CreateProjectPayload,
  {
    rejectValue: string;
  }
>("projects/createProject", async (payload, { rejectWithValue }) => {
  try {
    const response = await projectsService.createProject(payload);
    if (!response.success) {
      return rejectWithValue("Failed to create project");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create project"
    );
  }
});

export const updateProjectThunk = createAsyncThunk<
  Project,
  UpdateProjectPayload,
  {
    rejectValue: string;
  }
>("projects/updateProject", async (payload, { rejectWithValue }) => {
  try {
    const response = await projectsService.updateProject(payload);
    if (!response.success) {
      return rejectWithValue("Failed to update project");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update project"
    );
  }
});

export const deleteProjectThunk = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>("projects/deleteProject", async (projectId, { rejectWithValue }) => {
  try {
    const response = await projectsService.deleteProject(projectId);
    if (!response.success) {
      return rejectWithValue("Failed to delete project");
    }
    return projectId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete project"
    );
  }
});
