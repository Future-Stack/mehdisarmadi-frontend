import { baseApi } from "@/store/api/baseApi";

export const markReadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    markNotificationRead: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          message: string;
        };
      },
      string
    >({
      query: (id) => ({
        url: `notifications/mark-read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsRead: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          count: number;
          message: string;
        };
      },
      void
    >({
      query: () => ({
        url: "notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = markReadApi;