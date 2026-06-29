"use client";

import { useState } from "react";
import { Bell, Check, Trash2, AlertCircle, CheckCircle, Info, Trash } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { useGetNotificationsQuery } from "@/store/api/admin/Dashboard/Notifications/getNotification";
import { useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from "@/store/api/admin/Dashboard/Notifications/markRead";
import { useClearNotificationsMutation, useDeleteNotificationMutation } from "@/store/api/admin/Dashboard/Notifications/deleteNotification";
import { toast } from "sonner";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const {
    data,
    isLoading,
    isError,
  } = useGetNotificationsQuery(
    activeTab === "unread"
      ? { unreadOnly: true }
      : undefined
  );
  const [markNotificationRead, { isLoading: isMarking }] =
    useMarkNotificationReadMutation();

  const [markAllNotificationsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();

  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const [clearNotifications, { isLoading: isClearing }] =
    useClearNotificationsMutation();

  const handleMarkRead = async (id: string) => {
    try {
      const res = await markNotificationRead(id).unwrap();

      toast.success(
        res?.data?.message ||
        res?.message ||
        "Notification marked as read"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        "Failed to mark notification as read"
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsRead().unwrap();

      toast.success(
        res?.data?.message ||
        res?.message ||
        "All notifications marked as read"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        "Failed to mark all notifications as read"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteNotification(id).unwrap();

      toast.success(
        res?.data?.message ||
        res?.message ||
        "Notification deleted successfully"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        "Failed to delete notification"
      );
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await clearNotifications().unwrap();

      toast.success(
        res?.data?.message ||
        res?.message ||
        "All notifications cleared"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        "Failed to clear notifications"
      );
    }
  };
  const notifications = data?.data.notifications ?? [];
  const unreadCount = data?.data.unreadCount ?? 0;
  const totalCount = data?.data.totalCount ?? 0;
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load notifications.
      </div>
    );
  }
  return (
    <div className="space-y-6 w-full">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage
          title="Notifications"
          description={`${unreadCount} unread notifications`}
        />
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Check size={16} />
            {isMarkingAll ? "Marking..." : "Mark All as Read"}
          </button>
          <button
            onClick={handleClearAll}
            disabled={isClearing}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash size={16} />
            {isClearing ? "Clearing..." : "Clear All"}
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "all"
            ? "bg-secondary text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "unread"
            ? "bg-secondary text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* ── List ── */}
      <div className="space-y-4 pt-2">

        {notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
            No notifications found.
          </div>
        ) :
          (notifications.map((notification) => {

            return (
              <div
                key={notification._id}
                className={`group flex items-start justify-between p-4 rounded-xl border-2  transition-all hover:shadow-md bg-white dark:bg-gray-900`}
              >
                <div className="flex gap-4">

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                      {notification.message}
                    </p>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <button
                      title="Mark as read"
                      onClick={() => handleMarkRead(notification._id)}
                      disabled={isMarking}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      <Check size={18} strokeWidth={2.5} />
                    </button>
                  )}
                  <button
                    title="Delete notification"
                    onClick={() => handleDelete(notification._id)}
                    disabled={isDeleting}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          }))}
      </div>
    </div>
  );
}
