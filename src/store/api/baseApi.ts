import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { getAccessTokenFromCookie } from "@/lib/axios";
import { clearCredentials } from "@/store/slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://mehdisarmadi.duckdns.org/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth.accessToken;
    if (!token && typeof window !== "undefined") {
      token = getAccessTokenFromCookie();
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Clear auth state in Redux
    api.dispatch(clearCredentials());
    
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login?reason=session_expired";
    }
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users", "QuoteTemplate", "Project", "Profile", "SystemSettings", "CompanyProfile", "GlobalSettings", "Projects", "Division", "Auth", "Notification", "Notifications", "Settings", "SourceTracking", "AILogs"],
  endpoints: () => ({}),
});
