"use client";

import React, { useState, useEffect } from "react";
import { Bell, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "@/store/api/settingsApi";

export function NotificationSettings() {
  const { data: notificationResponse, isLoading: isFetching } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings, { isLoading: isUpdating }] = useUpdateNotificationSettingsMutation();

  const [settings, setSettings] = useState({
    processingComplete: true,
    processingFailed: true,
    quoteExported: false,
    addendaUploaded: true,
  });

  useEffect(() => {
    if (notificationResponse?.data) {
      const dbSettings = notificationResponse.data;
      setSettings({
        processingComplete: dbSettings.processingComplete ?? true,
        processingFailed: dbSettings.processingFailed ?? true,
        quoteExported: dbSettings.quoteExported ?? false,
        addendaUploaded: dbSettings.addendaUploaded ?? true,
      });
    }
  }, [notificationResponse]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await updateNotificationSettings(settings).unwrap();
      toast.success("Notification settings saved successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to save notification settings.");
    }
  };

  const notificationOptions = [
    { key: "processingComplete" as const, title: "Processing Complete", description: "Receive a notification when tender processing is successfully completed." },
    { key: "processingFailed" as const, title: "Processing Failed", description: "Get alerted immediately if tender processing encounters an error." },
    { key: "quoteExported" as const, title: "Quote Exported", description: "Get notified when a quote is successfully exported to PDF or Excel." },
    { key: "addendaUploaded" as const, title: "Addenda Uploaded", description: "Receive updates when new addenda are uploaded to your tenders." },
  ];

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-xl shadow-sm">
        <Loader2 className="w-8 h-8 text-[#059669] animate-spin" />
      </div>
    );
  }

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
        {notificationOptions.map((n) => {
          const isEnabled = settings[n.key];
          return (
            <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{n.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{n.description}</p>
              </div>
              <button 
                onClick={() => toggleSetting(n.key)}
                className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${isEnabled ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 shadow-lg shadow-emerald-200 dark:shadow-none disabled:opacity-50"
        >
          {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
