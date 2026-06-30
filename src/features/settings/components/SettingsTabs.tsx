"use client";

import React, { useState } from "react";
import { User, Building2, FileText, Bell, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AccountSettings } from "./AccountSettings";
import { CompanySettings } from "./CompanySettings";
import { TemplateSettings } from "./TemplateSettings";
import { NotificationSettings } from "./NotificationSettings";
import { Sparkles } from "lucide-react";
import { AiRulesSettings } from "./AiRulesSettings";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "ai-rules", label: "AI Rules", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("account");

  const renderContent = () => {
    switch (activeTab) {
      case "account": return <AccountSettings />;
      case "company": return <CompanySettings />;
      case "templates": return <TemplateSettings />;
      case "ai-rules": return <AiRulesSettings />;
      case "notifications": return <NotificationSettings />;
      default: return <AccountSettings />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <Link
          href="/sub-user"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors group w-fit"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and application preferences</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border shadow-sm",
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200 dark:shadow-none translate-y-[-2px]"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
              )}
            >
              <Icon size={18} className={cn("transition-transform duration-300", isActive && "scale-110")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#0B0F1A]/80 dark:backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-800 p-8 lg:p-10 shadow-xl shadow-emerald-100/50 dark:shadow-none min-h-[500px] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {renderContent()}
      </div>
    </div>
  );
}
