import { baseApi } from "../../baseApi";


export interface RecentProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  timeRange?: string;
}

export interface RecentProject {
  id: string;
  projectName: string;
  files: number;
  addenda: number;
  status: "Completed" | "Processing" | "Needs Review";
  quote: boolean;
  updatedAt: string;
  relativeTime: string;
}

export interface RecentProjectsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    filters: {
      search: string;
      status: string;
      timeRange: string;
    };
    items: RecentProject[];
  };
}

export const recentProjectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentProjects: builder.query<
      RecentProjectsResponse,
      RecentProjectsParams
    >({
      query: ({
        page = 1,
        limit = 5,
        search = "",
        status = "",
        timeRange = "",
      }) => ({
        url: "/projects",
        method: "GET",
        params: {
          page,
          limit,
          search,
          status,
          timeRange,
        },
      }),
      providesTags: ["Projects"],
    }),
  }),
});

export const { useGetRecentProjectsQuery } = recentProjectsApi;