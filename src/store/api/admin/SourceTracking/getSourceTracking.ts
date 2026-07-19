import { baseApi } from "@/store/api/baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SourceTrackingScopeItem {
  id: string;
  notes: string;
  source: {
    page: number | null;
    document: string;
  };
  actions: {
    canEdit: boolean;
    canDelete: boolean;
    canDuplicate: boolean;
  };
  include: boolean;
  division: string;
  quantity: {
    unit: string;
    value: number;
  };
  scopeItem: string;
}

export interface SourceTrackingMappedSections {
  items: SourceTrackingScopeItem[];
  title: string;
  filters: {
    id: string;
    code: string;
    label: string;
    active: boolean;
  }[];
  showing: string;
  total_items: number;
}

export interface SourceTrackingItem {
  id: string;
  fileName: string;
  storedName: string;
  type: string;
  typeLabel: string;
  kind: string;
  projectId: string;
  projectName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  status: string;
  mappedSections: SourceTrackingMappedSections | { action: string } | null;
  mappedSectionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetSourceTrackingParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

interface GetSourceTrackingResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    filters: {
      search: string | null;
      type: string;
    };
    items: SourceTrackingItem[];
  };
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const getSourceTrackingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSourceTracking: builder.query<GetSourceTrackingResponse, GetSourceTrackingParams | undefined>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.search?.trim()) queryParams.search = params.search.trim();
        if (params?.type && params.type !== "all") queryParams.type = params.type;

        return { url: "admin/source-tracking", method: "GET", params: queryParams };
      },
      providesTags: ["SourceTracking"],
    }),
  }),
});

export const { useGetSourceTrackingQuery } = getSourceTrackingApi;
