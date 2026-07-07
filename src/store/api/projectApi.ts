import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types";

export interface DashboardStats {
  cards: {
    totalTender: { value: number };
    activeQuotes: { value: number };
    pendingReviews: { value: number };
    totalValue: { value: number; formattedValue: string };
  };
  quickStats: {
    aiAnalyses: { value: number };
    quotesExported: { value: number };
    avgProcessing: { value: number; unit: string; label: string };
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    projectId: string | null;
    createdAt: string;
    relativeTime: string;
  }>;
}

export interface ProjectListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: any;
  items: Array<{
    id: string;
    name: string;
    clientName: string;
    clientContact: string;
    address: string;
    description: string;
    status: string;
    statusLabel: string;
    questionDate: string;
    closingDate: string;
    value: number;
    valueFormatted: string;
    fileCount: number;
    tenderFileCount: number;
    addendumFileCount: number;
    analysisSectionCount: number;
    createdAt: string;
    updatedAt: string;
    highPriority?: boolean;
  }>;
}

export interface Division {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  clientName: string;
  clientContact: string;
  closingDate: string;
  questionDate: string;
  address: string;
  description: string;
  instruction: string;
  aiOptions: string[];
  status: string;
  files: any[];
  fileCount: number;
  tenderFileCount: number;
  addendumFileCount: number;
  divisions: Division[];
}

export const projectApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProjectDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => "/project/dashboard",
      providesTags: ["Project"],
    }),
    getProjectDashboardProjects: builder.query<
      ApiResponse<ProjectListResponse>,
      { page?: number; limit?: number; status?: string; timeRange?: string }
    >({
      query: (params) => ({
        url: "/project/dashboard/projects",
        params,
      }),
      providesTags: ["Project"],
    }),
    getProjects: builder.query<
      ApiResponse<ProjectListResponse>,
      { page?: number; limit?: number; status?: string; timeRange?: string }
    >({
      query: (params) => ({
        url: "/project",
        params,
      }),
      providesTags: ["Project"],
    }),
    getDivisions: builder.query<ApiResponse<Division[]>, void>({
      query: () => "/project/divisions",
      providesTags: ["Division"],
    }),
    createProject: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: "/project",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Project"],
    }),
    getProjectById: builder.query<ApiResponse<ProjectDetail>, string>({
      query: (id) => `/project/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    getProjectReview: builder.query<ApiResponse<any>, string>({
      query: (id) => `/project/${id}/review`,
      providesTags: (result, error, id) => [{ type: "Project", id: `${id}_review` }],
    }),
  }),
});

export const {
  useGetProjectDashboardStatsQuery,
  useGetProjectDashboardProjectsQuery,
  useGetProjectsQuery,
  useGetDivisionsQuery,
  useCreateProjectMutation,
  useGetProjectByIdQuery,
  useGetProjectReviewQuery,
} = projectApi;
