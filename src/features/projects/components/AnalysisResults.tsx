/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useGetProjectByIdQuery, useGetProjectSummaryQuery } from "@/store/api/projectApi";
import { cn } from "@/lib/utils";

import SummaryTab from "@/features/projects/components/analysis/SummaryTab";
import ScopeTab from "@/features/projects/components/analysis/ScopeTab";
import PricingTab from "@/features/projects/components/analysis/PricingTab";
import RisksTab from "@/features/projects/components/analysis/RisksTab";
import ClarificationsTab from "@/features/projects/components/analysis/ClarificationsTab";
import AssumptionsTab from "@/features/projects/components/analysis/AssumptionsTab";
import ExclusionsTab from "@/features/projects/components/analysis/ExclusionsTab";
import AddendaTab from "@/features/projects/components/analysis/AddendaTab";

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "scope", label: "Scope" },
  { id: "pricing", label: "Pricing" },
  { id: "risks", label: "Risks" },
  { id: "clarifications", label: "Clarifications" },
  { id: "assumptions", label: "Assumptions" },
  { id: "exclusions", label: "Exclusions" },
  { id: "addenda", label: "Addenda" },
];

export default function AnalysisResults({ dashboardPath = "/admin" }: { dashboardPath?: string }) {
  const [activeTab, setActiveTab] = useState("summary");
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const projectId = (Array.isArray(idParam) ? idParam[0] : idParam) || "";

  const { data: projectData } = useGetProjectByIdQuery(projectId, { skip: !projectId });
  const { data: summaryData } = useGetProjectSummaryQuery(projectId, { skip: !projectId });

  const project = projectData?.data;
  const summaryPayload = summaryData?.data?.payload || summaryData?.data;
  const divisionLabel = summaryPayload?.selected_divisions
    ?.map((d: any) => d.name)
    .join(" • ");

  const handleBuildQuote = () => {
    const basePath = typeof window !== "undefined" && window.location.pathname.includes("/admin") ? "/admin" : "/sub-user";
    router.push(`${basePath}/projects/${projectId}/quote`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECFDF5] to-white dark:from-emerald-950/20 dark:to-[#0B0F1A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-500 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
          <div className="space-y-3">
            <Link
              href={dashboardPath}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#059669] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Tenders
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {project?.name ? `${project.name} - AI Analysis` : "AI Analysis Results"}
              </h1>
              <p className="text-gray-400 dark:text-gray-500 font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                {divisionLabel || project?.clientName || "Project Analysis"}
              </p>
            </div>
          </div>
          <button
            onClick={handleBuildQuote}
            className="w-full sm:w-auto bg-[#059669] h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-black text-white text-sm shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-[#047857] transition-all active:scale-95 flex-shrink-0"
          >
            Build Quote
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm transition-colors min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all text-center whitespace-nowrap",
                    isActive
                      ? "bg-[#059669] text-white shadow-md scale-[1.02]"
                      : "bg-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container - All Dynamic! */}
        <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-6 md:p-8 shadow-sm min-h-[600px] transition-colors duration-300">
          {activeTab === "summary" && <SummaryTab projectId={projectId} />}
          {activeTab === "scope" && <ScopeTab projectId={projectId} />}
          {activeTab === "pricing" && <PricingTab projectId={projectId} />}
          {activeTab === "risks" && <RisksTab projectId={projectId} />}
          {activeTab === "clarifications" && <ClarificationsTab projectId={projectId} />}
          {activeTab === "assumptions" && <AssumptionsTab projectId={projectId} />}
          {activeTab === "exclusions" && <ExclusionsTab projectId={projectId} />}
          {activeTab === "addenda" && <AddendaTab projectId={projectId} />}
        </div>
      </div>
    </div>
  );
}
