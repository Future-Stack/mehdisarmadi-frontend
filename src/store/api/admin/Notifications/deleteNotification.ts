import { baseApi } from "@/store/api/baseApi";

export const deleteNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteNotification: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          count: number;
          message: string;
        };
      },
      string
    >({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    clearNotifications: builder.mutation<
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
        url: "notifications",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useDeleteNotificationMutation,
  useClearNotificationsMutation,
} = deleteNotificationApi;