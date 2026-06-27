import { baseApi } from "../../baseApi";

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    cards: {
      totalUsers: {
        value: number;
      };
      activeProjects: {
        value: number;
      };
      completedAnalyses: {
        value: number;
      };
    };
    recentActivity: RecentActivity[];
  };
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  projectId: string | null;
  relativeTime: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardResponse, void>({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
      providesTags: ["Project", "User"],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
