import { baseApi } from "@/store/api/baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AILogActions {
  view: boolean;
  retry: boolean;
  review_and_fix: boolean;
}

export interface AILogDetails {
  document: {
    file_name: string;
    document_id: string;
    file_type: string;
    source_type: string;
  };
  project: {
    user_id: string;
    user_owner: string;
    project_id: string;
    project_name: string;
  };
  processing: {
    stage: string;
    status: string;
    error_message: string | null;
    divisions_selected: string[];
    instructions_given: string;
  };
  timing: {
    timestamp: string;
    duration: string;
  };
  output: {
    output_version: string;
    total_chunks: number;
    page_count: number | null;
    file_size: number;
  };
}

export interface AILogItem {
  file_name: string;
  project_name: string;
  stage: string;
  status: string;
  error_message: string | null;
  timestamp: string;
  duration: string;
  actions: AILogActions;
  details: AILogDetails;
}

export interface GetAILogsResponse {
  success: boolean;
  message: string;
  data: AILogItem[];
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const getAILogsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAILogs: builder.query<GetAILogsResponse, void>({
      query: () => ({
        url: "admin/ai-logs",
        method: "GET",
      }),
      providesTags: ["AILogs"],
    }),
  }),
});

export const { useGetAILogsQuery } = getAILogsApi;
