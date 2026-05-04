"use client";

import { useState } from "react";
import { Bell, Check, Trash2, AlertCircle, CheckCircle, Info, Trash } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = "error" | "warning" | "success" | "info" | "system";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "error",
    title: "AI Processing Failed",
    description: "AI failed to process document (Project ID #1023)",
    timestamp: "2026-04-25 12:30:00",
    isUnread: true,
  },
  {
    id: "2",
    type: "warning",
    title: "Upload Delay",
    description: "Large file upload delay detected",
    timestamp: "2026-04-25 11:45:00",
    isUnread: true,
  },
  {
    id: "3",
    type: "success",
    title: "Processing Complete",
    description: "AI processing completed for \"Office Fitout\"",
    timestamp: "2026-04-25 12:30:00",
    isUnread: false,
  },
  {
    id: "4",
    type: "info",
    title: "New User Registered",
    description: "Sarah Johnson has joined the platform",
    timestamp: "2026-04-25 09:15:00",
    isUnread: false,
  },
  {
    id: "5",
    type: "success",
    title: "Project Analyzed",
    description: "Project \"City Mall Tender\" analyzed successfully",
    timestamp: "2026-04-25 12:30:00",
    isUnread: false,
  },
  {
    id: "6",
    type: "warning",
    title: "Storage Warning",
    description: "Storage capacity at 85% - consider upgrading",
    timestamp: "2026-04-25 12:30:00",
    isUnread: false,
  },
  {
    id: "7",
    type: "success",
    title: "System Update",
    description: "AI model updated to GPT-4 Turbo",
    timestamp: "2026-04-25 12:30:00",
    isUnread: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case "error":
      return {
        border: "border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/20",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        accent: "border-l-red-500",
      };
    case "warning":
      return {
        border: "border-yellow-200 bg-yellow-50/30 dark:border-yellow-900/30 dark:bg-yellow-950/20",
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        accent: "border-l-yellow-500",
      };
    case "success":
      return {
        border: "border-green-200 bg-green-50/30 dark:border-green-900/30 dark:bg-green-950/20",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        accent: "border-l-green-500",
      };
    case "info":
      return {
        border: "border-blue-200 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/20",
        icon: <Info className="w-5 h-5 text-blue-500" />,
        accent: "border-l-blue-500",
      };
    default:
      return {
        border: "border-gray-200 bg-gray-50/30 dark:border-gray-700/30 dark:bg-gray-800/20",
        icon: <Bell className="w-5 h-5 text-gray-500" />,
        accent: "border-l-gray-500",
      };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const unreadCount = NOTIFICATIONS.filter((n) => n.isUnread).length;
  const filteredNotifications = activeTab === "unread" 
    ? NOTIFICATIONS.filter((n) => n.isUnread)
    : NOTIFICATIONS;

  return (
    <div className="space-y-6 w-full">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage 
          title="Notifications" 
          description={`${unreadCount} unread notifications`} 
        />
        <div className="flex items-center gap-3 self-start">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
            <Check size={16} />
            Mark All as Read
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 dark:bg-gray-900 dark:border-red-950/30 dark:text-red-400 dark:hover:bg-red-900/20">
            <Trash size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "all"
              ? "bg-secondary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
          }`}
        >
          All ({NOTIFICATIONS.length})
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "unread"
              ? "bg-secondary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* ── List ── */}
      <div className="space-y-4 pt-2">
        {filteredNotifications.map((notification) => {
          const styles = getTypeStyles(notification.type);
          return (
            <div
              key={notification.id}
              className={`group flex items-start justify-between p-4 rounded-xl border-2 ${styles.border} ${styles.accent} transition-all hover:shadow-md bg-white dark:bg-gray-900`}
            >
              <div className="flex gap-4">
                <div className="mt-1">{styles.icon}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    {notification.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                    {notification.description}
                  </p>
                  <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">
                    {notification.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {notification.isUnread && (
                  <button 
                    title="Mark as read"
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </button>
                )}
                <button 
                  title="Delete notification"
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
