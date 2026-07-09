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

export interface UpdateAiRulesDto {
  generalInstructions?: string;
  pricingSpecificInstructions?: string;
  scopeAnalysisInstructions?: string;
  defaultAssumptions?: string;
  defaultExclusions?: string;
}

export interface UpdateProjectAnalysisSectionDto {
  payload: any;
  note?: string;
}

export interface ReanalyzeProjectSectionDto {
  instruction: string;
}

export interface SaveProjectQuoteDto {
  quote: any;
  status?: string;
}

export interface CreateDivisionDto {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDivisionDto {
  code?: string;
  name?: string;
  description?: string;
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
      { page?: number; limit?: number; status?: string; timeRange?: string; search?: string }
    >({
      query: (params) => ({
        url: "/project/dashboard/projects",
        params,
      }),
      providesTags: ["Project"],
    }),
    getProjects: builder.query<
      ApiResponse<ProjectListResponse>,
      { page?: number; limit?: number; status?: string; timeRange?: string; search?: string }
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
    deleteProjectFile: builder.mutation<ApiResponse<any>, { projectId: string; fileId: string }>({
      query: ({ projectId, fileId }) => ({
        url: `/project/${projectId}/files/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Project", id: projectId }],
    }),
    getProjectAnalysisSection: builder.query<ApiResponse<any>, { projectId: string; section: string }>({
      query: ({ projectId, section }) => `/project/${projectId}/analysis/${section}`,
      providesTags: (result, error, { projectId, section }) => [{ type: "Project", id: `${projectId}_analysis_${section}` }],
    }),
    updateProjectAnalysisSection: builder.mutation<ApiResponse<any>, { projectId: string; section: string; data: UpdateProjectAnalysisSectionDto }>({
      query: ({ projectId, section, data }) => ({
        url: `/project/${projectId}/analysis/${section}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId, section }) => [{ type: "Project", id: `${projectId}_analysis_${section}` }],
    }),
    getProjectSummary: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/summary`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_summary` }],
    }),
    getProjectScope: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/scope`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_scope` }],
    }),
    getProjectPricing: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/pricing`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_pricing` }],
    }),
    getProjectRisks: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/risks`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_risks` }],
    }),
    getProjectClarifications: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/clarifications`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_clarifications` }],
    }),
    getProjectAssumptions: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/assumptions`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_assumptions` }],
    }),
    getProjectExclusions: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/exclusions`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_exclusions` }],
    }),
    getProjectAddenda: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/addenda`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_addenda` }],
    }),
    getProjectQuote: builder.query<ApiResponse<any>, string>({
      query: (projectId) => `/project/${projectId}/quote`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `${projectId}_quote` }],
    }),
    deleteProjectAnalysisItem: builder.mutation<
      ApiResponse<any>,
      { projectId: string; section: string; itemId: string }
    >({
      query: ({ projectId, section, itemId }) => ({
        url: `/project/${projectId}/analysis/${section}/item/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, section }) => [
        { type: "Project", id: `${projectId}_analysis_${section}` },
        { type: "Project", id: `${projectId}_${section}` },
      ],
    }),
    reanalyzeProjectSection: builder.mutation<
      ApiResponse<any>,
      { projectId: string; section: string; data: { instruction: string } }
    >({
      query: ({ projectId, section, data }) => ({
        url: `/project/${projectId}/analysis/${section}/reanalyze`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId, section }) => [
        { type: "Project", id: `${projectId}_analysis_${section}` },
        { type: "Project", id: `${projectId}_${section}` },
      ],
    }),
    acceptProposedChanges: builder.mutation<
      ApiResponse<any>,
      { projectId: string; section: string }
    >({
      query: ({ projectId, section }) => ({
        url: `/project/${projectId}/analysis/${section}/proposed/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { projectId, section }) => [
        { type: "Project", id: `${projectId}_analysis_${section}` },
        { type: "Project", id: `${projectId}_${section}` },
      ],
    }),
    rejectProposedChanges: builder.mutation<
      ApiResponse<any>,
      { projectId: string; section: string }
    >({
      query: ({ projectId, section }) => ({
        url: `/project/${projectId}/analysis/${section}/proposed`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, section }) => [
        { type: "Project", id: `${projectId}_analysis_${section}` },
        { type: "Project", id: `${projectId}_${section}` },
      ],
    }),
    saveProjectQuote: builder.mutation<
      ApiResponse<any>,
      { projectId: string; data: SaveProjectQuoteDto }
    >({
      query: ({ projectId, data }) => ({
        url: `/project/${projectId}/quote`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: `${projectId}_quote` },
        { type: "Project", id: projectId },
      ],
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
  useDeleteProjectFileMutation,
  useGetProjectAnalysisSectionQuery,
  useUpdateProjectAnalysisSectionMutation,
  useGetProjectSummaryQuery,
  useGetProjectScopeQuery,
  useGetProjectPricingQuery,
  useGetProjectRisksQuery,
  useGetProjectClarificationsQuery,
  useGetProjectAssumptionsQuery,
  useGetProjectExclusionsQuery,
  useGetProjectAddendaQuery,
  useGetProjectQuoteQuery,
  useDeleteProjectAnalysisItemMutation,
  useReanalyzeProjectSectionMutation,
  useAcceptProposedChangesMutation,
  useRejectProposedChangesMutation,
  useSaveProjectQuoteMutation,
} = projectApi;
