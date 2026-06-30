import { baseApi } from "@/store/api/baseApi";

export interface Notification {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetNotificationsResponse {
    success: boolean;
    message: string;
    data: {
        notifications: Notification[];
        unreadCount: number;
        totalCount: number;
    };
}

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            GetNotificationsResponse,
            { unreadOnly?: boolean } | undefined
        >({
            query: (params) => ({
                url: "notifications",
                params,
            }),
            providesTags: ["Notifications"],
        })
    }),
});

export const { useGetNotificationsQuery } = notificationApi;