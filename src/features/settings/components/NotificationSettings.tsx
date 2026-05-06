"use client";

import React, { useState } from "react";
import { Bell, Save } from "lucide-react";
import { Button } from "@/components/ui";

export function NotificationSettings() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Processing Complete", description: "Receive a notification when project processing is successfully completed.", enabled: true },
    { id: 2, title: "Processing Failed", description: "Get alerted immediately if project processing encounters an error.", enabled: true },
    { id: 3, title: "Quote Exported", description: "Get notified when a quote is successfully exported to PDF or Excel.", enabled: false },
    { id: 4, title: "Addenda Uploaded", description: "Receive updates when new addenda are uploaded to your projects.", enabled: true },
  ]);

  const toggleNotification = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
          <Bell size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose how you want to be notified</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{n.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{n.description}</p>
            </div>
            <button 
              onClick={() => toggleNotification(n.id)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${n.enabled ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${n.enabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
