import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { getAccessTokenFromCookie } from "@/lib/axios";

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

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Users", "QuoteTemplate", "Project", "Profile", "SystemSettings", "CompanyProfile", "GlobalSettings", "Projects", "Division", "Auth", "Notification", "Notifications", "Settings"],
  endpoints: () => ({}),
});
